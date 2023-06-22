using System.Net.Http.Headers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Vendors.MicrosoftGraph;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseThumbnailQuery : IRequest<string>
{
    public Guid ReleaseId { get; set; }
}

public class ReleaseThumbnailHandler : IRequestHandler<ReleaseThumbnailQuery, string>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    private readonly MicrosoftGraphTokenProvider _tokenProvider;

    private const string DefaultAlbumArt = "/default-art.svg";

    public ReleaseThumbnailHandler(TotallyWiredDbContext context, ICurrentUser user, MicrosoftGraphTokenProvider tokenProvider)
    {
        _context = context;
        _user = user;
        _tokenProvider = tokenProvider;
    }

    private static GraphServiceClient GetGraphClient(string accessToken)
    {
        return new GraphServiceClient((IAuthenticationProvider)null!)
        {
            AuthenticationProvider = new DelegateAuthenticationProvider(request =>
            {
                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", accessToken);

                return Task.CompletedTask;
            })
        };
    }

    public async Task<string> Handle(ReleaseThumbnailQuery request, CancellationToken cancellationToken)
    {
        var resource = await _context.Releases
            .Where(r => r.Id == request.ReleaseId && r.UserId == _user.UserId)
            .Select(r => new
                { r.ResourceId, r.ThumbnailUrl, Tracks = r.Tracks.Select(t => new { t.ResourceId, t.SourceId }) })
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return DefaultAlbumArt;
        }

        if (!string.IsNullOrEmpty(resource.ThumbnailUrl))
        {
            return resource.ThumbnailUrl;
        }

        var sourceId = resource.Tracks.Select(x => x.SourceId).FirstOrDefault();
        var (accessToken, _) = await _tokenProvider.GetAccessTokenAsync(sourceId);
        var graphClient = GetGraphClient(accessToken);

        try
        {
            var filterByIds = resource.Tracks
                .Select(x => x.ResourceId)
                .ToArray();

            var req = graphClient.Me.Drive
                .Items[resource.ResourceId]
                .Children
                .Request()
                .Expand("thumbnails($select=id,medium)")
                .Select("id,thumbnails");
  
            var collection = await req.GetAsync(cancellationToken);
            var thumbnails = collection.FirstOrDefault(x => filterByIds.Contains(x.Id))?.Thumbnails;
            
            if (!(thumbnails?.Any() ?? false))
            {
                return DefaultAlbumArt;
            }
            
            var mediumUrl = thumbnails[0]?.Medium?.Url;
            return mediumUrl ?? DefaultAlbumArt;
        }
        catch (ServiceException)
        {
            Console.WriteLine(resource.ResourceId);
        }

        return DefaultAlbumArt;
    }
}
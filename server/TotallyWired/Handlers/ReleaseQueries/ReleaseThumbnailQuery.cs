using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using TotallyWired.Contracts;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseThumbnailHandler : IRequestHandler<Guid, string>
{
    private readonly ICurrentUser _user;
    private readonly TotallyWiredDbContext _context;
    private readonly MicrosoftGraphTokenProvider _tokenProvider;

    private const string DefaultAlbumArt = "/default-art.svg";

    public ReleaseThumbnailHandler(ICurrentUser user, TotallyWiredDbContext context, MicrosoftGraphTokenProvider tokenProvider)
    {
        _user = user;
        _context = context;
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

    public async Task<string> HandleAsync(Guid releaseId, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        if (userId is null)
        {
            return string.Empty;
        }

        var resource = await _context.Releases
            .Where(r => r.Id == releaseId && r.UserId == userId)
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
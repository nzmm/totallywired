using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Vendors.MicrosoftGraph;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackDownloadUrlQuery
{
    public Guid TrackId { get; set; }
}

public class TrackDownloadUrlHandler : IRequestHandler<TrackDownloadUrlQuery, string>
{
    private const string DownloadUrlAttribute = "@microsoft.graph.downloadUrl";
    
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    private readonly MicrosoftGraphClientProvider _clientProvider;
    
    public TrackDownloadUrlHandler(TotallyWiredDbContext context, ICurrentUser user, MicrosoftGraphClientProvider clientProvider)
    {
        _context = context;
        _user = user;
        _clientProvider = clientProvider;
    }
    
    public async Task<string> HandleAsync(TrackDownloadUrlQuery request, CancellationToken cancellationToken)
    {
        var resource = await _context.Tracks
            .Where(t => t.Id == request.TrackId && t.UserId == _user.UserId)
            .Select(t => new { t.ResourceId, t.SourceId })
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return string.Empty;
        }

        var graphClient = await _clientProvider.GetClientAsync(resource.SourceId);
        if (graphClient is null)
        {
            return string.Empty;
        }

        var item = await graphClient.Me.Drive
            .Items[resource.ResourceId]
            .Request()
            .Select(DownloadUrlAttribute)
            .GetAsync(cancellationToken);

        if (item.AdditionalData.TryGetValue(DownloadUrlAttribute, out var downloadUrl) && downloadUrl != null)
        {
            return downloadUrl.ToString() ?? string.Empty;
        }

        return string.Empty;
    }
}
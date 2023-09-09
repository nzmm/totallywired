using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackDownloadUrlQueryHandler : IRequestHandler<Guid, string>
{
    private const string DownloadUrlAttribute = "@microsoft.graph.downloadUrl";

    private readonly ICurrentUser _user;
    private readonly TotallyWiredDbContext _context;
    private readonly MicrosoftGraphClientProvider _clientProvider;

    public TrackDownloadUrlQueryHandler(
        ICurrentUser user,
        TotallyWiredDbContext context,
        MicrosoftGraphClientProvider clientProvider
    )
    {
        _user = user;
        _context = context;
        _clientProvider = clientProvider;
    }

    public async Task<string> HandleAsync(Guid trackId, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        if (userId is null)
        {
            return string.Empty;
        }

        var resource = await _context.Tracks
            .Where(t => t.Id == trackId && t.UserId == userId)
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

        var item = await graphClient.Me.Drive.Items[resource.ResourceId]
            .Request()
            .Select(DownloadUrlAttribute)
            .GetAsync(cancellationToken);

        if (
            item.AdditionalData.TryGetValue(DownloadUrlAttribute, out var downloadUrl)
            && downloadUrl != null
        )
        {
            return downloadUrl.ToString() ?? string.Empty;
        }

        return string.Empty;
    }
}

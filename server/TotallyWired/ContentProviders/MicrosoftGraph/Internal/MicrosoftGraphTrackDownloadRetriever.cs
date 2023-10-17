using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.ContentProviders.MicrosoftGraph.Internal;

public class MicrosoftGraphTrackDownloadRetriever(
    TotallyWiredDbContext context,
    MicrosoftGraphClientProvider clientProvider
) : IContentRetriever<string>
{
    private const string DownloadUrlAttribute = "@microsoft.graph.downloadUrl";

    public async Task<string> RetrieveAsync(
        Guid userId,
        Guid trackId,
        CancellationToken cancellationToken
    )
    {
        var resource = await context.Tracks
            .Where(t => t.Id == trackId && t.UserId == userId)
            .Select(t => new { t.ResourceId, t.SourceId })
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return string.Empty;
        }

        var graphClient = await clientProvider.GetClientAsync(resource.SourceId);
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

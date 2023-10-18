using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.ContentProviders.MicrosoftGraph.Internal;

public class MicrosoftGraphReleaseArtRetriever(
    TotallyWiredDbContext context,
    MicrosoftGraphClientProvider clientProvider
) : IContentRetriever<string>
{
    public async Task<string> RetrieveAsync(
        Guid userId,
        Guid releaseId,
        CancellationToken cancellationToken
    )
    {
        var resource = await context.Releases
            .Where(r => r.Id == releaseId && r.UserId == userId)
            .Select(
                r =>
                    new
                    {
                        r.ResourceId,
                        Tracks = r.Tracks.Select(t => new { t.SourceId, t.ResourceId })
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return string.Empty;
        }

        var sourceId = resource.Tracks.Select(x => x.SourceId).FirstOrDefault();
        var graphClient = await clientProvider.GetClientAsync(sourceId);

        if (graphClient is null)
        {
            return string.Empty;
        }

        try
        {
            var resourceId = resource.ResourceId;
            var filterByIds = resource.Tracks.Select(x => x.ResourceId).ToArray();

            var req = graphClient.Me.Drive.Items[resourceId].Children
                .Request()
                .Expand("thumbnails($select=id,medium)")
                .Select("id,thumbnails");

            var collection = await req.GetAsync(cancellationToken);
            var thumbnails = collection.FirstOrDefault(x => filterByIds.Contains(x.Id))?.Thumbnails;

            if (!(thumbnails?.Any() ?? false))
            {
                return string.Empty;
            }

            var mediumUrl = thumbnails[0]?.Medium?.Url;
            return mediumUrl ?? string.Empty;
        }
        catch (ServiceException)
        {
            // Console.WriteLine(resource.ResourceId);
        }

        return string.Empty;
    }
}

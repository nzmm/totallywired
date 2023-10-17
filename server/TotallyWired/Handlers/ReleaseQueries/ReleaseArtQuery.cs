using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseArtQueryHandler(
    TotallyWiredDbContext context,
    ICurrentUser user,
    IServiceProvider services,
    RegisteredContentProviders registry
) : IRequestHandler<Guid, string>
{
    private const string DefaultAlbumArt = "/default-art.svg";

    public async Task<string> HandleAsync(Guid releaseId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();

        var resource = await context.Releases
            .Where(r => r.Id == releaseId && r.UserId == userId)
            .Select(
                r =>
                    new
                    {
                        r.ThumbnailUrl,
                        SourceType = r.Tracks.Select(t => t.Source.Type).FirstOrDefault()
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return string.Empty;
        }
        if (!string.IsNullOrEmpty(resource.ThumbnailUrl))
        {
            return resource.ThumbnailUrl;
        }

        var provider = registry.GetProvider(resource.SourceType);
        var retriever = provider.GetReleaseArtRetriever(services);
        var thumbnail = await retriever.RetrieveAsync(userId, releaseId, cancellationToken);
        return string.IsNullOrEmpty(thumbnail) ? DefaultAlbumArt : thumbnail;
    }
}

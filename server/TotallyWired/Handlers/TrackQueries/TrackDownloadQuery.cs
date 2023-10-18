using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackDownloadQueryHandler(
    TotallyWiredDbContext context,
    ContentProviderServices providers,
    ICurrentUser user
) : IAsyncRequestHandler<Guid, string>
{
    public async Task<string> HandleAsync(Guid trackId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();
        var sourceType = await context.Tracks
            .Where(x => x.Id == trackId && x.UserId == userId)
            .Select(x => x.Source.Type)
            .FirstOrDefaultAsync(cancellationToken);

        var provider = providers.GetProvider(sourceType);
        if (provider is null)
        {
            return string.Empty;
        }

        var downloadUri = await provider.TrackDownload.RetrieveAsync(
            userId,
            trackId,
            cancellationToken
        );

        return downloadUri;
    }
}

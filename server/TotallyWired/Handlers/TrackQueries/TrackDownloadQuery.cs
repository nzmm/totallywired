using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackDownloadQueryHandler(
    TotallyWiredDbContext context,
    IServiceProvider services,
    ICurrentUser user,
    RegisteredContentProviders registry
) : IRequestHandler<Guid, string>
{
    public async Task<string> HandleAsync(Guid trackId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();
        var sourceType = await context.Tracks
            .Where(x => x.Id == trackId && x.UserId == userId)
            .Select(x => x.Source.Type)
            .FirstOrDefaultAsync(cancellationToken);

        var provider = registry.GetProvider(sourceType);
        var retriever = provider.GetTrackDownloadRetriever(services);
        return await retriever.RetrieveAsync(userId, trackId, cancellationToken);
    }
}

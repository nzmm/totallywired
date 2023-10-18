using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.SourceCommands;

public class SourceSyncCommandHandler(
    TotallyWiredDbContext context,
    ContentProviderServices providers,
    ICurrentUser user
) : IAsyncRequestHandler<Guid, (bool, string)>
{
    public async Task<(bool, string)> HandleAsync(
        Guid sourceId,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var source = await context.Sources
            .Include(x => x.User)
            .FirstOrDefaultAsync(
                x => x.Id == sourceId && x.UserId == userId,
                cancellationToken: cancellationToken
            );

        if (source is null)
        {
            return (false, $"Source '{sourceId}' does not exist");
        }

        var provider = providers.GetProvider(source.Type);
        if (provider is null)
        {
            return (false, "Provider not found");
        }

        var (success, message) = await provider.Indexer.IndexAsync(source);
        return success
            ? (success, message)
            : (false, $"No handlers configured for source '{source.Id}'");
    }
}

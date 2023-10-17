using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.SourceCommands;

public class SourceSyncCommandHandler(
    IServiceProvider services,
    ICurrentUser user,
    TotallyWiredDbContext context,
    RegisteredContentProviders registry
) : IRequestHandler<Guid, (bool, string)>
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

        var provider = registry.GetProvider(source.Type);
        var indexer = provider.GetIndexer(services);

        var (success, message) = await indexer.IndexAsync(source);
        if (success)
        {
            return (success, message);
        }

        return (false, $"No handlers configured for source '{source.Id}'");
    }
}

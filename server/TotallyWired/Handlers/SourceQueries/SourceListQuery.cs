using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceListQueryHandler(
    TotallyWiredDbContext context,
    ContentProviderRegistry registry,
    ICurrentUser user
) : IAsyncRequestHandler<IEnumerable<SourceGroupListModel>>
{
    public async Task<IEnumerable<SourceGroupListModel>> HandleAsync(
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var groupings = await context.Sources
            .Where(x => x.UserId == userId)
            .Select(
                x =>
                    new SourceListModel
                    {
                        Id = x.Id,
                        SourceType = x.Type,
                        TrackCount = x.Tracks.Count()
                    }
            )
            .GroupBy(x => x.SourceType, x => x)
            .ToDictionaryAsync(
                x => x.Key.ToString().ToLowerInvariant(),
                x => x.ToArray(),
                cancellationToken
            );

        var registered = registry.RegisteredServiceProviders.Keys;
        return registered.Select(k =>
        {
            groupings.TryGetValue(k, out var sourceList);
            return new SourceGroupListModel
            {
                GroupName = k,
                ContentProviders = sourceList ?? Enumerable.Empty<SourceListModel>()
            };
        });
    }
}

using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<IEnumerable<SourceTypeListModel>>
{
    public async Task<IEnumerable<SourceTypeListModel>> HandleAsync(
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var sources = await context.Sources
            .Where(x => x.UserId == userId)
            .Select(
                x =>
                    new SourceListModel
                    {
                        SourceId = x.Id,
                        SourceType = x.Type,
                        CreatedOn = x.Created,
                        ModifiedOn = x.Modified,
                        TrackCount = x.Tracks.Count()
                    }
            )
            .GroupBy(x => x.SourceType, x => x)
            .ToDictionaryAsync(x => x.Key, x => x.ToArray(), cancellationToken);

        return Enum.GetValues<SourceType>()
            .Where(t => t != SourceType.None)
            .Select(t =>
            {
                sources.TryGetValue(t, out var typedSources);
                return new SourceTypeListModel
                {
                    SourceType = t,
                    Providers = typedSources ?? Enumerable.Empty<SourceListModel>()
                };
            });
    }
}

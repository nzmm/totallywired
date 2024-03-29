using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceQueryHandler(TotallyWiredDbContext context, ICurrentUser user)
    : IAsyncRequestHandler<Guid, SourceModel?>
{
    public async Task<SourceModel?> HandleAsync(Guid sourceId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();

        var source = await context.Sources
            .Where(x => x.Id == sourceId && x.UserId == userId)
            .Select(
                x =>
                    new SourceModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        SourceType = x.Type,
                        CreatedOn = x.Created,
                        ModifiedOn = x.Modified,
                        TrackCount = x.Tracks.Count()
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return source;
    }
}

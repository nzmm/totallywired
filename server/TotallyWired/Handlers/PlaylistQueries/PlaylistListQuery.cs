using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.PlaylistQueries;

public class PlaylistListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<IEnumerable<PlaylistListModel>>
{
    public async Task<IEnumerable<PlaylistListModel>> HandleAsync(
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        // special case: liked tracks
        var likedCount = await context.Tracks
            .Where(
                t =>
                    t.UserId == userId
                    && t.Reactions.Any(r => r.UserId == userId && r.Reaction == ReactionType.Liked)
            )
            .CountAsync(cancellationToken);

        return new[]
        {
            new PlaylistListModel
            {
                Id = Guid.Empty,
                Name = "Liked tracks",
                UserId = userId,
                TrackCount = likedCount,
                Position = 0
            }
        }; //.OrderBy(x => x.Position);
    }
}

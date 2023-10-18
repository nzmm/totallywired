using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.TrackCommands;

public class TrackReactionCommand
{
    public Guid TrackId { get; set; }
    public ReactionType Reaction { get; set; }
}

public class TrackReactionCommandHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<TrackReactionCommand, ReactionType>
{
    public async Task<ReactionType> HandleAsync(
        TrackReactionCommand request,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var track = await context.Tracks
            .Include(x => x.Reactions.Where(r => r.UserId == userId))
            .Where(x => x.Id == request.TrackId && x.UserId == userId)
            .Select(
                x =>
                    new
                    {
                        x.Id,
                        x.SourceId,
                        x.Reactions
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (track is null)
        {
            return ReactionType.None;
        }

        var reaction = track.Reactions.MaxBy(x => x.Created);

        switch (reaction)
        {
            case null when request.Reaction == ReactionType.None:
                return ReactionType.None;
            case null:
                reaction = new TrackReaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    TrackId = track.Id,
                    Reaction = request.Reaction
                };

                await context.AddAsync(reaction, cancellationToken);
                break;
            default:
                reaction.Reaction = request.Reaction;
                break;
        }

        await context.SaveChangesAsync(cancellationToken);
        return request.Reaction;
    }
}

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

public class TrackReactionHandler : IRequestHandler<TrackReactionCommand, (bool, ReactionType)>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public TrackReactionHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<(bool, ReactionType)> HandleAsync(TrackReactionCommand request, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        if (userId is null)
        {
            return (false, ReactionType.None);
        }

        var track = await _context.Tracks
            .Include(x => x.Reactions)
            .Where(x => x.Id == request.TrackId && x.UserId == userId)
            .Select(x => new { x.Id, x.SourceId, x.Reactions })
            .FirstOrDefaultAsync(cancellationToken);

        if (track is null)
        {
            return (false, ReactionType.None);
        }

        var reaction = track.Reactions.MaxBy(x => x.Created);
        
        switch (reaction)
        {
            case null when request.Reaction == ReactionType.None:
                return (true, ReactionType.Liked);
            case null:
                reaction = new TrackReaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId.Value,
                    TrackId = track.Id,
                    Reaction = request.Reaction
                };

                await _context.AddAsync(reaction, cancellationToken);
                break;
            default:
                reaction.Reaction = request.Reaction;
                break;                
        }

        await _context.SaveChangesAsync(cancellationToken);

        return (true, request.Reaction);
    }
}
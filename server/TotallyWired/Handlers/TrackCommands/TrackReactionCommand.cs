using MediatR;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.TrackCommands;

public class TrackReactionCommand : IRequest<(bool, ReactionType)>
{
    public Guid TrackId { get; set; }
    public ReactionType Reaction { get; set; }
}

public class TrackReactionHandler : IRequestHandler<TrackReactionCommand, (bool, ReactionType)>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public TrackReactionHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<(bool, ReactionType)> Handle(TrackReactionCommand request, CancellationToken cancellationToken)
    {
        var track = await _context.Tracks
            .Include(x => x.Reactions)
            .Where(x => x.Id == request.TrackId && x.UserId == _user.UserId)
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
                    UserId = _user.UserId,
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
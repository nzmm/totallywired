using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackQueryHandler : IRequestHandler<Guid, TrackListModel>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public TrackQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task<TrackListModel> HandleAsync(Guid trackId, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        var track = await _context.Tracks
            .Where(t => t.Id == trackId && t.UserId == userId)
            .Select(
                t =>
                    new TrackListModel
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Number = t.Number,
                        ReleaseId = t.ReleaseId,
                        ReleaseName = t.ReleaseName,
                        ArtistId = t.ArtistId,
                        ArtistName = t.Artist.Name,
                        Disc = t.Disc,
                        Length = t.Length,
                        DisplayLength = t.DisplayLength,
                        Liked = t.Reactions.Any(
                            r => r.UserId == userId && r.Reaction == ReactionType.Liked
                        )
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return track ?? new TrackListModel();
    }
}

using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IRequestHandler<Guid, TrackListModel>
{
    public async Task<TrackListModel> HandleAsync(Guid trackId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();
        var track = await context.Tracks
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

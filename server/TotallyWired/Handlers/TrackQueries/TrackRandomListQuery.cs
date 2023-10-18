using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackRandomListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<int?, IEnumerable<TrackListModel>>
{
    public async Task<IEnumerable<TrackListModel>> HandleAsync(
        int? take,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();
        var validatedTake = Math.Max(1, Math.Min(100, take ?? 25));

        return await context.Tracks
            .Where(x => x.UserId == userId)
            .OrderBy(t => EF.Functions.Random())
            .Take(validatedTake)
            .Select(
                t =>
                    new TrackListModel
                    {
                        Id = t.Id,
                        ArtistId = t.ArtistId,
                        ReleaseId = t.ReleaseId,
                        Name = t.Name,
                        ArtistName = t.Artist.Name,
                        ReleaseName = t.ReleaseName,
                        Disc = t.Disc,
                        Number = t.Number,
                        Length = t.Length,
                        DisplayLength = t.DisplayLength,
                        Liked = t.Reactions.Any(r => r.Reaction == ReactionType.Liked)
                    }
            )
            .ToArrayAsync(cancellationToken);
    }
}

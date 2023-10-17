using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IRequestHandler<Guid, ReleaseModel?>
{
    public async Task<ReleaseModel?> HandleAsync(
        Guid releaseId,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var release = await context.Releases
            .Where(r => r.Id == releaseId && r.UserId == userId)
            .Select(
                r =>
                    new ReleaseModel
                    {
                        Id = r.Id,
                        ArtistId = r.ArtistId,
                        Year = r.Year,
                        Name = r.Name,
                        ArtistName = r.Artist.Name,
                        RecordLabel = r.RecordLabel,
                        Country = r.Country,
                        Type = r.Type,
                        CoverArtUrl = r.ThumbnailUrl,
                        MusicBrainzId = r.MusicBrainzId
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return release;
    }
}

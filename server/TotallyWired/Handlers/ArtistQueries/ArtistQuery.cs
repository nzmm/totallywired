using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IRequestHandler<Guid, ArtistModel?>
{
    public async Task<ArtistModel?> HandleAsync(Guid artistId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();

        var artist = await context.Artists
            .Where(a => a.Id == artistId && a.UserId == userId)
            .Select(
                a =>
                    new ArtistModel
                    {
                        Id = a.Id,
                        Name = a.Name,
                        CoverArtUrl = a.ThumbnailUrl,
                        MusicBrainzId = a.MusicBrainzId
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return artist;
    }
}

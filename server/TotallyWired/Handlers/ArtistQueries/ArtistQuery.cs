using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistQueryHandler : IRequestHandler<Guid, ArtistModel?>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public ArtistQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<ArtistModel?> HandleAsync(Guid artistId, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();

        var artist = await _context.Artists
            .Where(a => a.Id == artistId && a.UserId == userId)
            .Select(
                a =>
                    new ArtistModel
                    {
                        Id = a.Id,
                        Name = a.Name,
                        CoverArtUrl = a.ThumbnailUrl
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return artist;
    }
}

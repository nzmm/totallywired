using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseQueryHandler : IRequestHandler<Guid, ReleaseModel?>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public ReleaseQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<ReleaseModel?> HandleAsync(
        Guid releaseId,
        CancellationToken cancellationToken
    )
    {
        var userId = _user.UserId();

        var release = await _context.Releases
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
                        CoverArtUrl = r.ThumbnailUrl
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        return release;
    }
}

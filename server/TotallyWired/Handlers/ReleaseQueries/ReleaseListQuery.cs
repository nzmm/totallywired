using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseListQueryHandler : IRequestHandler<IEnumerable<ReleaseListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public ReleaseListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        if (userId is null)
        {
            return Enumerable.Empty<ReleaseListModel>();
        }

        var releases = await _context.Releases
            .Where(t => t.UserId == userId)
            .Select(r => new ReleaseListModel
            {
                Id = r.Id,
                ArtistId = r.ArtistId,
                Year = r.Year,
                Name = r.Name,
                ArtistName = r.Artist.Name
            })
            .OrderBy(x => x.ArtistName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Name)
            .ToArrayAsync(cancellationToken);

        return releases;
    }
}
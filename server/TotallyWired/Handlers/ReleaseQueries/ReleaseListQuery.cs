using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseListHandler : IRequestHandler<IEnumerable<ReleaseListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public ReleaseListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(CancellationToken cancellationToken)
    {
        var releases = await _context.Releases
            .Where(t => t.UserId == _user.UserId)
            .Select(r => new ReleaseListModel
            {
                Id = r.Id,
                ArtistId = r.ArtistId,
                Year = r.Year,
                Name = r.Name,
                ArtistName = r.Artist.Name,
                RecordLabel = r.RecordLabel,
                Country = r.Country,
                CoverArtUrl = r.ThumbnailUrl
            })
            .OrderBy(x => x.ArtistName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Name)
            .ToArrayAsync(cancellationToken);

        return releases;
    }
}
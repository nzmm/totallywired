using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseListSearchParams
{
    public string? Q { get; set; }
    public int? Year { get; set; }
}

public class ReleaseListQueryHandler
    : IRequestHandler<ReleaseListSearchParams, IEnumerable<ReleaseListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public ReleaseListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(
        ReleaseListSearchParams @params,
        CancellationToken cancellationToken
    )
    {
        var userId = _user.UserId();
        var year = @params.Year;
        var tsQuery = @params.Q.TsQuery();
        var hasQuery = tsQuery.Length >= 3;

        var query = hasQuery
            ? _context.Releases.FromSqlInterpolated(
                $"SELECT * FROM search_releases({userId}, {tsQuery})"
            )
            : _context.Releases.Where(t => t.UserId == userId);

        if (@params.Year.HasValue)
        {
            query = query.Where(r => r.Year == year);
        }

        var releases = await query
            .Select(
                r =>
                    new ReleaseListModel
                    {
                        Id = r.Id,
                        ArtistId = r.ArtistId,
                        Year = r.Year,
                        Name = r.Name,
                        ArtistName = r.Artist.Name
                    }
            )
            .OrderBy(x => x.ArtistName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Name)
            .ToArrayAsync(cancellationToken);

        return releases;
    }
}

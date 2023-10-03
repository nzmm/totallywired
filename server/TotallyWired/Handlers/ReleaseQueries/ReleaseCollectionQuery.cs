using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseCollectionSearchParams
{
    public string? Q { get; set; }
    public int? Year { get; set; }
    public string? Label { get; set; }
    public string? Country { get; set; }
}

public class ReleaseCollectionQueryHandler
    : IRequestHandler<ReleaseCollectionSearchParams, IEnumerable<ReleaseListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public ReleaseCollectionQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(
        ReleaseCollectionSearchParams @params,
        CancellationToken cancellationToken
    )
    {
        var userId = _user.UserId();
        var year = @params.Year;
        var label = @params.Label;
        var country = @params.Country;
        var tsQuery = @params.Q.TsQuery();
        var hasQuery = tsQuery.Length >= 2;

        var query = hasQuery
            ? _context.Releases.FromSqlInterpolated(
                $"SELECT * FROM search_releases({userId}, {tsQuery})"
            )
            : _context.Releases.Where(t => t.UserId == userId);

        if (@params.Year.HasValue)
        {
            query = query.Where(r => r.Year == year);
        }
        if (!string.IsNullOrEmpty(@params.Label))
        {
            query = query.Where(r => r.RecordLabel == label);
        }
        if (!string.IsNullOrEmpty(@params.Country))
        {
            query = query.Where(r => r.Country == country);
        }

        var releases = await query
            .Select(
                r =>
                    new ReleaseCollectionModel
                    {
                        Id = r.Id,
                        ArtistId = r.ArtistId,
                        Year = r.Year,
                        Name = r.Name,
                        ArtistName = r.Artist.Name,
                        RecordLabel = r.RecordLabel,
                        Country = r.Country,
                        TrackCount = r.Tracks.Count()
                    }
            )
            .OrderBy(x => x.ArtistName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Name)
            .ToArrayAsync(cancellationToken);

        return releases;
    }
}

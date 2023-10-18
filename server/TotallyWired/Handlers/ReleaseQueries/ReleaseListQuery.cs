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
    public string? Label { get; set; }
    public string? Country { get; set; }
}

public class ReleaseListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<ReleaseListSearchParams, IEnumerable<ReleaseListModel>>
{
    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(
        ReleaseListSearchParams @params,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();
        var year = @params.Year;
        var label = @params.Label;
        var country = @params.Country;
        var tsQuery = @params.Q.TsQuery();
        var hasQuery = tsQuery.Length >= 3;

        var query = hasQuery
            ? context.Releases.FromSqlInterpolated(
                $"SELECT * FROM search_releases({userId}, {tsQuery})"
            )
            : context.Releases.Where(t => t.UserId == userId);

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

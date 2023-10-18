using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistListSearchParams
{
    public string? Q { get; set; }
}

public class ArtistListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<ArtistListSearchParams, IEnumerable<ArtistListModel>>
{
    public async Task<IEnumerable<ArtistListModel>> HandleAsync(
        ArtistListSearchParams request,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();
        var q = request.Q?.Trim() ?? string.Empty;

        var query =
            q.Length < 3
                ? context.Artists.Where(t => t.UserId == userId)
                : context.Artists.FromSqlInterpolated(
                    $"SELECT * FROM search_artists({userId}, {q.TsQuery()})"
                );

        return await query
            .Select(a => new ArtistListModel { Id = a.Id, Name = a.Name })
            .ToArrayAsync(cancellationToken);
    }
}

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

public class ArtistListQueryHandler
    : IRequestHandler<ArtistListSearchParams, IEnumerable<ArtistListModel>>
{
    private readonly ICurrentUser _user;
    private readonly TotallyWiredDbContext _context;

    public ArtistListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _user = user;
        _context = context;
    }

    public async Task<IEnumerable<ArtistListModel>> HandleAsync(
        ArtistListSearchParams request,
        CancellationToken cancellationToken
    )
    {
        var userId = _user.UserId();
        var q = request.Q?.Trim() ?? string.Empty;

        var query =
            q.Length < 3
                ? _context.Artists.Where(t => t.UserId == userId)
                : _context.Artists.FromSqlInterpolated(
                    $"SELECT * FROM search_artists({userId}, {q.TsQuery()})"
                );

        return await query
            .Select(a => new ArtistListModel { Id = a.Id, Name = a.Name })
            .ToArrayAsync(cancellationToken);
    }
}

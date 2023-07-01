using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistListSearchParams
{
    public string? Q { get; set; }
}

public class ArtistListHandler : IRequestHandler<ArtistListSearchParams, IEnumerable<ArtistListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public ArtistListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ArtistListModel>> HandleAsync(ArtistListSearchParams request, CancellationToken cancellationToken)
    {
        var q = request.Q?.Trim() ?? string.Empty;

        var query = q.Length < 3
            ? _context.Artists.Where(t => t.UserId == _user.UserId)
            : _context.Artists.FromSqlInterpolated($"SELECT * FROM search_artists({_user.UserId}, {q.TsQuery()})");
        
        return await query
            .Select(a => new ArtistListModel
            {
                Id = a.Id,
                Name = a.Name
            })
            .ToArrayAsync(cancellationToken);
    }
}
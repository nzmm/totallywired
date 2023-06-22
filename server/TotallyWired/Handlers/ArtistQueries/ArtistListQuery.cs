using MediatR;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistListQuery : IRequest<IEnumerable<ArtistListModel>>
{
    public string? Terms { get; set; }
}

public class ArtistListHandler : IRequestHandler<ArtistListQuery, IEnumerable<ArtistListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public ArtistListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ArtistListModel>> Handle(ArtistListQuery request, CancellationToken cancellationToken)
    {
        var terms = request.Terms?.Trim() ?? string.Empty;

        var query = terms.Length < 3
            ? _context.Artists.Where(t => t.UserId == _user.UserId)
            : _context.Artists.FromSqlInterpolated($"SELECT * FROM search_artists({_user.UserId}, {terms.TsQuery()})");
        
        var artists = await query
            .Select(a => new ArtistListModel
            {
                Id = a.Id,
                Name = a.Name
            })
            .ToArrayAsync(cancellationToken);
        
        return artists;
    }
}
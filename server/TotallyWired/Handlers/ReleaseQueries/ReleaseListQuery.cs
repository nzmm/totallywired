using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseQueries;

public class ReleaseListQuery
{
    public string? Terms { get; init; }
    public bool IncludeTracks { get; init; }
}

public class ReleaseListHandler : IRequestHandler<ReleaseListQuery, IEnumerable<ReleaseListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public ReleaseListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<ReleaseListModel>> HandleAsync(ReleaseListQuery request, CancellationToken cancellationToken)
    {
        var terms = request.Terms?.Trim() ?? string.Empty;

        var query = terms.Length < 3
            ? _context.Releases.Where(t => t.UserId == _user.UserId)
            : _context.Releases.FromSqlInterpolated($"SELECT * FROM search_releases({_user.UserId}, {terms.TsQuery()})");
        
        var releases = await query.Select(r => new ReleaseListModel
            {
                Id = r.Id,
                ArtistId = r.ArtistId,
                Year = r.Year,
                Name = r.Name,
                ArtistName = r.Artist.Name,
                RecordLabel = r.RecordLabel,
                Country = r.Country,
                CoverArtUrl = r.ThumbnailUrl,
                Tracks = r.Tracks
                    .Where(_ => request.IncludeTracks)
                    .OrderBy(x => x.Disc)
                    .ThenBy(t => t.Position)
                    .ThenBy(t => t.Name).Select(t => new TrackListModel
                    {
                        Id = t.Id,
                        ArtistId = t.ArtistId,
                        ReleaseId = t.ReleaseId,
                        Name = t.Name,
                        ArtistName = t.Artist.Name,
                        ArtistCredit = t.ArtistCredit,
                        ReleaseName = t.ReleaseName,
                        Number = t.Number,
                        Position = t.Position,
                        Disc = t.Disc,
                        DisplayLength = t.DisplayLength,
                        Length = t.Length,
                        Liked = t.Reactions.Any(x => x.Reaction == ReactionType.Liked)
                    })
            })
            .OrderBy(x => x.ArtistName)
            .ThenBy(x => x.Year)
            .ThenBy(x => x.Name)
            .ToArrayAsync(cancellationToken);

        return releases;
    }
}
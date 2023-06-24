using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackListQuery
{
    public string? Terms { get; init; }
    public bool RestrictToLiked { get; init; }
}

public class TrackListHandler : IRequestHandler<TrackListQuery, IEnumerable<TrackListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public TrackListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<TrackListModel>> HandleAsync(TrackListQuery request, CancellationToken cancellationToken)
    {
        var terms = request.Terms?.Trim() ?? string.Empty;

        var query = terms.Length < 3
            ? _context.Tracks.Where(t => t.UserId == _user.UserId)
            : _context.Tracks.FromSqlInterpolated($"SELECT * FROM search_tracks({_user.UserId}, {terms.TsQuery()})");

        if (request.RestrictToLiked)
        {
            query = query.Where(t => t.Reactions.Any(r => r.Reaction == ReactionType.Liked));
        }

        return await query.Select(t => new TrackListModel
        {
            Id = t.Id,
            ArtistId = t.ArtistId,
            ReleaseId = t.ReleaseId,
            Name = t.Name,
            ArtistName = t.Artist.Name,
            ArtistCredit = t.ArtistCredit,
            ReleaseName = t.ReleaseName,
            CoverArtUrl = t.Release.ThumbnailUrl,
            Number = t.Number,
            Disc = t.Disc,
            DisplayLength = t.DisplayLength,
            Length = t.Length,
            Liked = t.Reactions.Any(r => r.Reaction == ReactionType.Liked)
        }).ToArrayAsync(cancellationToken);
    }
}
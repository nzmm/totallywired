using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackListSearchParams
{
    public Guid? ReleaseId { get; set; }
    public Guid? ArtistId { get; set; }
    public string? Q { get; set; }
    public bool? Liked { get; set; }
}

public class TrackListQueryHandler
    : IRequestHandler<TrackListSearchParams, IEnumerable<TrackListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;

    public TrackListQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _user = user;
        _context = context;
    }

    private async Task<IEnumerable<TrackListModel>> GetQueryAsync(
        TrackListSearchParams @params,
        CancellationToken cancellationToken
    )
    {
        var userId = _user.UserId();

        var releaseId = @params.ReleaseId;
        var artistId = @params.ArtistId;
        var liked = @params.Liked;

        var tsQuery = @params.Q.TsQuery();
        var hasQuery = tsQuery.Length >= 3;

        var query = hasQuery
            ? _context.Tracks.FromSqlInterpolated(
                $"SELECT * FROM search_tracks({userId}, {tsQuery})"
            )
            : _context.Tracks.Where(t => t.UserId == userId);

        if (releaseId.HasValue)
        {
            query = query.Where(t => releaseId == t.ReleaseId);
        }
        else if (artistId.HasValue)
        {
            query = query.Where(t => artistId == t.ArtistId);
        }
        if (liked ?? false)
        {
            query = query.Where(
                t => t.Reactions.Any(r => r.UserId == userId && r.Reaction == ReactionType.Liked)
            );
        }
        if (!hasQuery)
        {
            query = query
                .OrderBy(t => t.Artist)
                .ThenBy(t => t.Release)
                .ThenBy(t => t.Disc)
                .ThenBy(t => t.Position);
        }

        return await query
            .Select(
                t =>
                    new TrackListModel
                    {
                        Id = t.Id,
                        ArtistId = t.ArtistId,
                        ReleaseId = t.ReleaseId,
                        Name = t.Name,
                        ArtistName = t.Artist.Name,
                        ReleaseName = t.ReleaseName,
                        Number = t.Number,
                        Length = t.Length,
                        DisplayLength = t.DisplayLength,
                        Liked = t.Reactions.Any(r => r.Reaction == ReactionType.Liked)
                    }
            )
            .ToArrayAsync(cancellationToken);
    }

    public Task<IEnumerable<TrackListModel>> HandleAsync(
        TrackListSearchParams searchParams,
        CancellationToken cancellationToken
    )
    {
        return GetQueryAsync(searchParams, cancellationToken);
    }
}

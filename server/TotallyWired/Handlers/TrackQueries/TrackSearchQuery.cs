using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackSearchHandler : IRequestHandler<string, TrackListModel[]>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public TrackSearchHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<TrackListModel[]> HandleAsync(string query, CancellationToken cancellationToken)
    {
        var terms = query.Trim();
        if (terms.Length < 3)
        {
            return Array.Empty<TrackListModel>();
        }

        var tsQuery = terms.TsQuery();
        var tracks = await _context.Tracks
            .FromSqlInterpolated($"SELECT * FROM search_tracks({_user.UserId}, {tsQuery})")
            .Select(t => new TrackListModel
            {
                Id = t.Id,
                ArtistId = t.ArtistId,
                ReleaseId = t.ReleaseId,
                Name = t.Name,
                ArtistName = t.Artist.Name,
                ArtistCredit = t.ArtistCredit,
                ReleaseName = t.ReleaseName,
                Number = t.Number,
                Disc = t.Disc,
                DisplayLength = t.DisplayLength,
                Length = t.Length,
                Liked = t.Reactions.Any(r => r.Reaction == ReactionType.Liked)
            })
            .ToArrayAsync(cancellationToken);

        return tracks;
    }
}
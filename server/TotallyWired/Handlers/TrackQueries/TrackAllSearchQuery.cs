using MediatR;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Infrastructure.EntityFramework.Extensions;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackAllSearchQuery : IRequest<TrackAllSearchModel>
{
    public string Terms { get; init; } = default!;
}

public class TrackAllSearchHandler : IRequestHandler<TrackAllSearchQuery, TrackAllSearchModel>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public TrackAllSearchHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<TrackAllSearchModel> Handle(TrackAllSearchQuery request, CancellationToken cancellationToken)
    {
        var terms = request.Terms.Trim();
        if (terms.Length < 3)
        {
            return new TrackAllSearchModel();
        }

        var tsQuery = terms.TsQuery();
        
        var trackQuery = _context.Tracks
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
            .Take(12);

        var releaseQuery = _context.Releases
            .FromSqlInterpolated($"SELECT * FROM search_releases({_user.UserId}, {tsQuery})")
            .Select(r => new ReleaseListModel
            {
                Id = r.Id,
                ArtistId = r.ArtistId,
                Year = r.Year,
                Name = r.Name,
                ArtistName = r.Artist.Name,
                RecordLabel = r.RecordLabel,
                Country = r.Country,
                CoverArtUrl = r.ThumbnailUrl
            })
            .Take(6);

        var artistQuery = _context.Artists
            .FromSqlInterpolated($"SELECT * FROM search_artists({_user.UserId}, {tsQuery})")
            .Select(a => new ArtistListModel
            {
                Id = a.Id,
                Name = a.Name
            })
            .Take(6);

        // todo: make parallel
        var trackResults = await trackQuery.ToArrayAsync(cancellationToken);
        var releaseResults = await releaseQuery.ToArrayAsync(cancellationToken);
        var artistResults = await artistQuery.ToArrayAsync(cancellationToken);

        //await Task.WhenAll(trackResults, releaseResults, artistResults);

        return new TrackAllSearchModel
        {
            Tracks = trackResults,
            Releases = releaseResults,
            Artists = artistResults
        };
    }
}
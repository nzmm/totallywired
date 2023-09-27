using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Extensions;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseCommands;

public class ReleaseMetadataCommand
{
    public Guid ReleaseId { get; init; }
    public ReleaseMetadataModel Metadata { get; init; } = default!;
}

public class UpdateReleaseMetadataCommandHandler
    : IRequestHandler<ReleaseMetadataCommand, ReleaseMetadataUpdateResult>
{
    private readonly ICurrentUser _user;
    private readonly TotallyWiredDbContext _context;

    public UpdateReleaseMetadataCommandHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _user = user;
        _context = context;
    }

    private async Task<Artist> GetArtistToUpdateAsync(
        Guid userId,
        string artistMusicBrainzId,
        Release release,
        CancellationToken cancellationToken
    )
    {
        if (release.Artist.MusicBrainzId == artistMusicBrainzId)
        {
            return release.Artist;
        }

        var artist = await _context.Artists.FirstOrDefaultAsync(
            x => x.UserId == userId && x.MusicBrainzId == artistMusicBrainzId,
            cancellationToken
        );

        return artist ?? release.Artist;
    }

    private async Task<Release?> GetReleaseToUpdateAsync(
        Guid userId,
        string releaseMusicbrainzId,
        Guid releaseId,
        CancellationToken cancellationToken
    )
    {
        var release = await _context.Releases
            .Include(x => x.Artist)
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.MusicBrainzId == releaseMusicbrainzId,
                cancellationToken
            );

        if (release != null)
        {
            return release;
        }

        release = await _context.Releases
            .Include(x => x.Artist)
            .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == releaseId, cancellationToken);

        if (release is null || string.IsNullOrEmpty(release.MusicBrainzId))
        {
            return release;
        }

        var artist = new Artist
        {
            Id = Guid.NewGuid(),
            UserId = release.UserId,
            Name = release.Artist.Name,
            Description = string.Empty,
            ThumbnailUrl = string.Empty
        };

        release = new Release
        {
            Id = Guid.NewGuid(),
            UserId = release.UserId,
            ResourceId = release.ResourceId,
            Artist = artist,
            ArtistId = artist.Id,
            Name = release.Name,
            ThumbnailUrl = release.ThumbnailUrl,
            Year = release.Year,
            Country = release.Country,
            RecordLabel = release.RecordLabel,
            MusicBrainzId = release.MusicBrainzId
        };

        await _context.AddAsync(release, cancellationToken);

        return release;
    }

    private async Task<(int, int)> CleanupOrphanedArtistsAndReleases(
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        var releasesToClean = _context.Releases.Where(x => x.UserId == userId && !x.Tracks.Any());

        _context.Releases.RemoveRange(releasesToClean);
        var releasesRemoved = await _context.SaveChangesAsync(cancellationToken);

        var artistsToClean = _context.Artists.Where(x => x.UserId == userId && !x.Tracks.Any());

        _context.Artists.RemoveRange(artistsToClean);
        var artistsRemoved = await _context.SaveChangesAsync(cancellationToken);

        return (artistsRemoved, releasesRemoved);
    }

    public async Task<ReleaseMetadataUpdateResult> HandleAsync(
        ReleaseMetadataCommand request,
        CancellationToken cancellationToken
    )
    {
        var result = new ReleaseMetadataUpdateResult();

        var userId = _user.UserId();

        var metadataChanges = request.Metadata;
        if (
            request.ReleaseId == Guid.Empty
            || string.IsNullOrEmpty(metadataChanges.ArtistMbid)
            || string.IsNullOrEmpty(metadataChanges.ReleaseMbid)
        )
        {
            return result;
        }

        try
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(
                cancellationToken
            );

            var releaseToUpdate = await GetReleaseToUpdateAsync(
                userId,
                metadataChanges.ReleaseMbid,
                request.ReleaseId,
                cancellationToken
            );

            if (releaseToUpdate is null)
            {
                return result;
            }

            var artistToUpdate = await GetArtistToUpdateAsync(
                userId,
                metadataChanges.ArtistMbid,
                releaseToUpdate,
                cancellationToken
            );

            releaseToUpdate.Artist = artistToUpdate;
            releaseToUpdate.ArtistId = artistToUpdate.Id;

            releaseToUpdate.Artist.Name = metadataChanges.ArtistName;
            releaseToUpdate.Artist.MusicBrainzId = metadataChanges.ArtistMbid;

            releaseToUpdate.ThumbnailUrl = metadataChanges.CoverArtUrl.NotNull();
            releaseToUpdate.Name = metadataChanges.Name;
            releaseToUpdate.RecordLabel = metadataChanges.RecordLabel;
            releaseToUpdate.Country = metadataChanges.Country;
            releaseToUpdate.Type = metadataChanges.Type;
            releaseToUpdate.Year = metadataChanges.Year;
            releaseToUpdate.MusicBrainzId = metadataChanges.ReleaseMbid;

            await _context.SaveChangesAsync(cancellationToken);

            var trackIds = request.Metadata.Tracks.Select(x => x.TrackId).ToArray();

            var tracksToUpdate = trackIds.Any()
                ? await _context.Tracks
                    .Where(
                        x =>
                            x.UserId == userId
                            && x.ReleaseId == request.ReleaseId
                            && trackIds.Contains(x.Id)
                    )
                    .ToArrayAsync(cancellationToken)
                : Array.Empty<Track>();

            var trackMetadata = metadataChanges.Tracks.ToArray();

            foreach (var track in tracksToUpdate)
            {
                if (track.ArtistId != releaseToUpdate.ArtistId)
                {
                    track.Artist = releaseToUpdate.Artist;
                    track.ArtistId = releaseToUpdate.ArtistId;
                }
                if (track.ReleaseId != releaseToUpdate.Id)
                {
                    track.Release = releaseToUpdate;
                    track.ReleaseId = releaseToUpdate.Id;
                }

                var metadata = trackMetadata.FirstOrDefault(x => x.TrackId == track.Id);
                if (metadata is null)
                {
                    continue;
                }

                track.ArtistCredit = metadataChanges.ArtistName;
                track.ReleaseName = metadataChanges.Name;

                track.Name = metadata.TrackName;
                track.Number = metadata.Number;
                track.Position = metadata.Position;
                track.Disc = metadata.Disc;
                track.MusicBrainzId = metadata.TrackMbid;
            }

            await _context.SaveChangesAsync(cancellationToken);

            var (artistsRemoved, releasesRemoved) = await CleanupOrphanedArtistsAndReleases(
                userId,
                cancellationToken
            );

            await transaction.CommitAsync(cancellationToken);

            Console.WriteLine(
                $"releasesCleaned: {releasesRemoved} artistsCleaned: {artistsRemoved}"
            );

            result.Success = true;
            result.Release = releaseToUpdate;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            result.Success = false;
            result.Release = null;
        }

        return result;
    }
}

public class ReleaseMetadataUpdateResult
{
    public bool Success { get; set; }
    public Release? Release { get; set; }
}

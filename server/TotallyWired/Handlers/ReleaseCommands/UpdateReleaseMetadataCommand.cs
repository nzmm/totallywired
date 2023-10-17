using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Extensions;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.ReleaseCommands;

public class ReleaseMetadataCommand : ReleaseMetadataModel
{
    public Guid ReleaseId { get; set; }
}

public class UpdateReleaseMetadataCommandHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IRequestHandler<ReleaseMetadataCommand, ReleaseMetadataUpdateResult>
{
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

        var artist = await context.Artists.FirstOrDefaultAsync(
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
        var release = await context.Releases
            .Include(x => x.Artist)
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.MusicBrainzId == releaseMusicbrainzId,
                cancellationToken
            );

        if (release != null)
        {
            return release;
        }

        release = await context.Releases
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

        await context.AddAsync(release, cancellationToken);

        return release;
    }

    private async Task<(int, int)> CleanupOrphanedArtistsAndReleases(
        Guid userId,
        CancellationToken cancellationToken
    )
    {
        var releasesToClean = context.Releases.Where(x => x.UserId == userId && !x.Tracks.Any());

        context.Releases.RemoveRange(releasesToClean);
        var releasesRemoved = await context.SaveChangesAsync(cancellationToken);

        var artistsToClean = context.Artists.Where(x => x.UserId == userId && !x.Tracks.Any());

        context.Artists.RemoveRange(artistsToClean);
        var artistsRemoved = await context.SaveChangesAsync(cancellationToken);

        return (artistsRemoved, releasesRemoved);
    }

    public async Task<ReleaseMetadataUpdateResult> HandleAsync(
        ReleaseMetadataCommand request,
        CancellationToken cancellationToken
    )
    {
        var result = new ReleaseMetadataUpdateResult();

        var userId = user.UserId();

        if (
            request.ReleaseId == Guid.Empty
            || string.IsNullOrEmpty(request.ArtistMbid)
            || string.IsNullOrEmpty(request.ReleaseMbid)
        )
        {
            return result;
        }

        try
        {
            await using var transaction = await context.Database.BeginTransactionAsync(
                cancellationToken
            );

            var releaseToUpdate = await GetReleaseToUpdateAsync(
                userId,
                request.ReleaseMbid,
                request.ReleaseId,
                cancellationToken
            );

            if (releaseToUpdate is null)
            {
                return result;
            }

            var artistToUpdate = await GetArtistToUpdateAsync(
                userId,
                request.ArtistMbid,
                releaseToUpdate,
                cancellationToken
            );

            releaseToUpdate.Artist = artistToUpdate;
            releaseToUpdate.ArtistId = artistToUpdate.Id;
            releaseToUpdate.Artist.Name = request.ArtistName;
            releaseToUpdate.Artist.MusicBrainzId = request.ArtistMbid;
            releaseToUpdate.ThumbnailUrl = request.CoverArtUrl.NotNull();
            releaseToUpdate.Name = request.Name;
            releaseToUpdate.RecordLabel = request.RecordLabel;
            releaseToUpdate.Country = request.Country;
            releaseToUpdate.Type = request.Type;
            releaseToUpdate.Year = request.Year;
            releaseToUpdate.MusicBrainzId = request.ReleaseMbid;

            await context.SaveChangesAsync(cancellationToken);

            var trackIds = request.Tracks.Select(x => x.TrackId).ToArray();

            var tracksToUpdate = trackIds.Any()
                ? await context.Tracks
                    .Where(
                        x =>
                            x.UserId == userId
                            && x.ReleaseId == request.ReleaseId
                            && trackIds.Contains(x.Id)
                    )
                    .ToArrayAsync(cancellationToken)
                : Array.Empty<Track>();

            var tracks = request.Tracks.ToArray();

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

                var trackMetadata = tracks.FirstOrDefault(x => x.TrackId == track.Id);
                if (trackMetadata is null)
                {
                    continue;
                }

                track.ArtistCredit = request.ArtistName;
                track.ReleaseName = request.Name;
                track.Name = trackMetadata.Name;
                track.Number = trackMetadata.Number;
                track.Position = trackMetadata.Position;
                track.Disc = trackMetadata.Disc;
                track.MusicBrainzId = trackMetadata.TrackMbid;
            }

            await context.SaveChangesAsync(cancellationToken);

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

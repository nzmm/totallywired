using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Extensions;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Indexers.MicrosoftGraph;

public class MicrosoftGraphSourceIndexer : ISourceIndexer
{
    private readonly TotallyWiredDbContext _context;
    private readonly MicrosoftGraphClientProvider _clientProvider;

    public MicrosoftGraphSourceIndexer(
        TotallyWiredDbContext context,
        MicrosoftGraphClientProvider clientProvider)
    {
        _context = context;
        _clientProvider = clientProvider;
    }

    private static Task<IDriveItemDeltaCollectionPage> GetMusicPaged(GraphServiceClient graphClient, string delta)
    {
        if (string.IsNullOrEmpty(delta))
        {
            return graphClient.Me.Drive
                .Special["music"]
                .Delta()
                .Request()
                .Select("id,name,audio,parentReference")
                .GetAsync();
        }
    
        var deltaCollection = new DriveItemDeltaCollectionPage(); 
        deltaCollection.InitializeNextPageRequest(graphClient, delta);
        return deltaCollection.NextPageRequest.GetAsync();
    }

    private static async Task<(Artist, bool)> CreateOrUpdateArtistAsync(
        TotallyWiredDbContext context,
        BaseItem driveItem,
        Audio audio,
        Source source)
    {
        var fallbackName = audio.Artist.NotNull(driveItem.ParentReference.Name);
        var artistName = audio.AlbumArtist.NotNull(fallbackName);

        var artist = await context.Artists
            .FirstOrDefaultAsync(x => x.UserId == source.UserId && x.Name == artistName);

        if (artist is null)
        {
            var created = new Artist
            {
                Id = Guid.NewGuid(),
                User = source.User,
                UserId = source.UserId,
                Name = artistName,
                Description = string.Empty,
                ThumbnailUrl = string.Empty
            };
            
            await context.AddAsync(created);
            await context.SaveChangesAsync();
            
            return (created, true);
        }
        
        artist.Name = artistName;
        return (artist, false);
    }

    private static async Task<(Release, bool)> CreateOrUpdateReleaseAsync(
        TotallyWiredDbContext context,
        BaseItem driveItem,
        Audio audio,
        Source source,
        Guid artistId)
    {
        var parentId = driveItem.ParentReference.Id;
        var releaseName = audio.Album.NotNull(driveItem.ParentReference.Name);

        var release =
            await context.Releases.FirstOrDefaultAsync(x =>
                x.UserId == source.UserId && x.ArtistId == artistId && x.ResourceId == parentId);
        
        if (release is null)
        {
            var created = new Release
            {
                Id = Guid.NewGuid(),
                User = source.User,
                UserId = source.UserId,
                ArtistId = artistId,
                ResourceId = parentId,
                Name = releaseName,
                Year = audio.Year,
                ThumbnailUrl = string.Empty
            };
            
            await context.AddAsync(created);
            await context.SaveChangesAsync();
            
            return (created, true);
        }

        release.Name = releaseName;
        release.Year = audio.Year;
        return (release, false);
    }
    
    private static async Task<(Track, bool)> CreateOrUpdateTrackAsync(
        TotallyWiredDbContext context,
        BaseItem driveItem,
        Audio audio,
        Source source)
    {
        var (artist, _) = await CreateOrUpdateArtistAsync(context, driveItem, audio, source);
        var (release, _) = await CreateOrUpdateReleaseAsync(context, driveItem, audio, source, artist.Id);
     
        var track = await context.Tracks
            .FirstOrDefaultAsync(x => x.SourceId == source.Id && x.ResourceId == driveItem.Id);

        var durationMs = audio.Duration ?? 0;
        var displayLength = TimeSpan.FromMilliseconds(durationMs).DisplayDuration();
        
        if (track is null)
        {
            var created = new Track
            {
                Id = Guid.NewGuid(),
                Source = source,
                SourceId = source.Id,
                User = source.User,
                UserId = source.UserId,
                ArtistId = artist.Id,
                ReleaseId = release.Id,
                ResourceId = driveItem.Id,
                Disc = audio.Disc ?? 0,
                Position = audio.Track ?? 0,
                Number = $"{audio.Track ?? 0}",
                FileName = driveItem.Name.NotNull(),
                Name = audio.Title.NotNull(driveItem.Name),
                ArtistCredit = audio.Artist.NotNull(artist.Name),
                ReleaseName = release.Name,
                Genre = audio.Genre.NotNull(),
                ThumbnailUrl = string.Empty,
                Year = audio.Year ?? 0,
                BitRate = audio.Bitrate ?? 0,
                Length = durationMs,
                DisplayLength = displayLength
            };
                    
            await context.AddAsync(created);
            return (created, true);
        }

        track.ArtistId = artist.Id;
        track.ReleaseId = release.Id;
        track.Disc = audio.Disc ?? 0;
        track.Position = audio.Track ?? 0;
        track.Number = $"{audio.Track ?? 0}";
        track.FileName = driveItem.Name.NotNull();
        track.Name = audio.Title.NotNull(driveItem.Name);
        track.ArtistCredit = audio.Artist.NotNull(artist.Name);
        track.ReleaseName = release.Name;
        track.Genre = audio.Genre.NotNull();
        track.Year = audio.Year ?? 0;
        track.BitRate = audio.Bitrate ?? 0;
        track.Length = durationMs;
        track.DisplayLength = displayLength;

        return (track, false);
    }
    
    private static async Task<int> ProcessDeltaCollectionAsync(
        TotallyWiredDbContext context,
        IDriveItemDeltaCollectionPage page,
        Source source)
    {
        var trackCount = 0;

        foreach (var item in page)
        {
            // todo: handle deletions
            
            var audio = item?.Audio;
            if (audio is null)
            {
                continue;
            }

            var (track, _) = await CreateOrUpdateTrackAsync(context, item!, audio, source);
            
            Console.WriteLine($"[Indexed] {track.Artist} ({track.Year}) - {track.Name}");
            trackCount += 1;
        }

        await context.SaveChangesAsync();
        return trackCount;
    }
    
    public async Task<(bool, string)> IndexAsync(Source source)
    {
        if (source.Type != SourceType.MicrosoftGraph)
        {
            return (false, "Source type not supported");
        }

        var graphClient = await _clientProvider.GetClientAsync(source.Id);
        if (graphClient is null)
        {
            return (false, "Graph client not available. This could mean there is an issue with the access token.");
        }

        var page = await GetMusicPaged(graphClient, source.Delta);
        Console.WriteLine($"Page retrieved with length {page.Count}. Current update count is {0}.");

        var updateCount = await ProcessDeltaCollectionAsync(_context, page, source);

        while (page.NextPageRequest != null)
        {
            page = await page.NextPageRequest.GetAsync();
            Console.WriteLine($"Page retrieved with length {page.Count}. Current update count is {updateCount}.");
            updateCount += await ProcessDeltaCollectionAsync(_context, page, source);
        }
        
        if (page.AdditionalData.TryGetValue("@odata.deltaLink", out var deltaLink))
        {
            var delta = deltaLink?.ToString() ?? string.Empty;
            source.Delta = delta;
            await _context.SaveChangesAsync();
        }
        
        return (true, $"Finished sync. {updateCount} tracks updated.");
    }
}
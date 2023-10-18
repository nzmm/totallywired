using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders.MicrosoftGraph.Internal;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackFileQuery
{
    public Guid TrackId { get; init; }
}

public class ReleaseFilenameHandler(
    ICurrentUser user,
    TotallyWiredDbContext context,
    MicrosoftGraphClientProvider clientProvider
) : IAsyncRequestHandler<TrackFileQuery, TrackFileInfoModel>
{
    public async Task<TrackFileInfoModel> HandleAsync(
        TrackFileQuery request,
        CancellationToken cancellationToken
    )
    {
        var userId = user.UserId();

        var track = await context.Tracks
            .Where(r => r.Id == request.TrackId && r.UserId == userId)
            .Select(
                r =>
                    new
                    {
                        r.ResourceId,
                        r.SourceId,
                        r.BitRate,
                        r.FileName,
                        r.MusicBrainzId,
                        SourceType = r.Source.Type
                    }
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (track is null)
        {
            return new TrackFileInfoModel();
        }

        var trackInfo = new TrackFileInfoModel
        {
            TrackId = request.TrackId,
            SourceType = track.SourceType,
            FileName = track.FileName,
            BitRate = track.BitRate,
            MusicBrainzId = track.MusicBrainzId
        };

        var graphClient = await clientProvider.GetClientAsync(track.SourceId);
        if (graphClient is null)
        {
            return trackInfo;
        }

        var driveItem = await graphClient.Me.Drive.Items[track.ResourceId]
            .Request()
            .Select("name,createdDateTime,lastModifiedDateTime,webUrl,parentReference")
            .GetAsync(cancellationToken);

        if (driveItem is null)
        {
            return trackInfo;
        }

        trackInfo.Path = $"{driveItem.ParentReference.Path}/{driveItem.Name}";
        trackInfo.WebUrl = driveItem.WebUrl;
        trackInfo.Created = driveItem.CreatedDateTime;
        trackInfo.Modified = driveItem.LastModifiedDateTime;
        return trackInfo;
    }
}

using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;
using TotallyWired.Vendors.MicrosoftGraph;

namespace TotallyWired.Handlers.TrackQueries;

public class TrackFileInfoQuery
{
    public Guid TrackId { get; init; }
}

public class ReleaseFilenameHandler : IRequestHandler<TrackFileInfoQuery, TrackFileInfoModel>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    private readonly MicrosoftGraphClientProvider _clientProvider;

    public ReleaseFilenameHandler(TotallyWiredDbContext context, ICurrentUser user, MicrosoftGraphClientProvider clientProvider)
    {
        _context = context;
        _user = user;
        _clientProvider = clientProvider;
    }

    public async Task<TrackFileInfoModel> HandleAsync(TrackFileInfoQuery request, CancellationToken cancellationToken)
    {
        var track = await _context.Tracks
            .Where(r => r.Id == request.TrackId && r.UserId == _user.UserId)
            .Select(r => new
            {
                r.ResourceId,
                r.SourceId,
                r.BitRate,
                r.FileName,
                r.MusicBrainzId,
                SourceType = r.Source.Type
            })
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
        
        var graphClient = await _clientProvider.GetClientAsync(track.SourceId);
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
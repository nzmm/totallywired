namespace TotallyWired.Models;

public class TrackAllSearchModel
{
    public IEnumerable<TrackListModel> Tracks { get; set; } = Enumerable.Empty<TrackListModel>();
    public IEnumerable<ReleaseListModel> Releases { get; set; } =
        Enumerable.Empty<ReleaseListModel>();
    public IEnumerable<ArtistListModel> Artists { get; set; } = Enumerable.Empty<ArtistListModel>();
}

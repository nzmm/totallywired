namespace TotallyWired.Models;

public class ReleaseCollectionModel : ReleaseListModel
{
    public string RecordLabel { get; set; } = default!;
    public string Country { get; set; } = default!;
    public int TrackCount { get; set; }
}

namespace TotallyWired.Models;

public class ReleaseModel : ReleaseListModel
{
    public string RecordLabel { get; init; } = default!;
    public string Country { get; init; } = default!;
    public string CoverArtUrl { get; init; } = default!;
}

namespace TotallyWired.Models;

public class ReleaseListModel
{
    public Guid Id { get; init; }
    public Guid ArtistId { get; init; }
    public int? Year { get; init; }
    public string Name { get; init; } = default!;
    public string ArtistName { get; init; } = default!;
    public string RecordLabel { get; init; } = default!;
    public string Country { get; init; } = default!;
    public string CoverArtUrl { get; init; } = default!;
}
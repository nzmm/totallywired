namespace TotallyWired.Models;

public class TrackMetadataModel
{
    public Guid TrackId { get; set; }
    public string TrackMbid { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Number { get; set; } = default!;
    public int Position { get; set; }
    public int Disc { get; set; }
}

public class ReleaseMetadataModel
{
    public string ArtistMbid { get; set; } = default!;
    public string ReleaseMbid { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string ArtistName { get; set; } = default!;
    public string RecordLabel { get; set; } = default!;
    public string Type { get; set; } = default!;
    public string Country { get; set; } = default!;
    public int Year { get; set; }
    public string CoverArtUrl { get; set; } = default!;

    public IEnumerable<TrackMetadataModel> Tracks { get; set; } = new List<TrackMetadataModel>();
}

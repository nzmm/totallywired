namespace TotallyWired.Models;

public class TrackMetadataModel
{
    public Guid TrackId { get; set; }
    public string TrackMbid { get; set; } = default!;
    public string TrackName { get; set; } = default!;
    public string Number { get; set; } = default!;
    public int Position { get; set; }
    public int Disc { get; set; }
}

public class ReleaseMetadataModel
{
    public Guid ReleaseId { get; set; }
    public string ArtistMbid { get; set; } = default!;
    public string ReleaseMbid { get; set; } = default!;
    public string ReleaseName { get; set; } = default!;
    public string ArtistName { get; set; } = default!;
    public string LabelName { get; set; } = default!;
    public string Country { get; set; } = default!;
    public int Year { get; set; }
    public string CoverArtUrl { get; set; } = default!;

    public IEnumerable<TrackMetadataModel> Tracks { get; set; } = new List<TrackMetadataModel>();
}

namespace TotallyWired.Models;

public class ArtistModel : ArtistListModel
{
    public string CoverArtUrl { get; set; } = default!;
    public string MusicBrainzId { get; set; } = default!;
}

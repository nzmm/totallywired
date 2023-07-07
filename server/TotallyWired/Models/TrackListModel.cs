namespace TotallyWired.Models;

public class TrackListModel
{
    public Guid Id { get; set; }
    public Guid ArtistId { get; set; }
    public Guid ReleaseId { get; set; }
    public bool Liked { get; set; }
    public string Number { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string ArtistName { get; set; } = default!;
    public string ReleaseName { get; set; } = default!;
    public long Length { get; set; } = default!;
    public string DisplayLength { get; set; } = default!;
}
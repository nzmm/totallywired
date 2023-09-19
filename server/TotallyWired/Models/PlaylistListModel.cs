namespace TotallyWired.Models;

public class PlaylistListModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int Position { get; set; }
    public string Name { get; set; }
    public int TrackCount { get; set; }
}


using TotallyWired.Domain.Enums;

namespace TotallyWired.Models;

public class TrackFileInfoModel
{
    public Guid TrackId { get; init; }
    public SourceType SourceType { get; init; } = SourceType.None;
    public string FileName { get; init; } = default!;
    public string MusicBrainzId { get; init; } = default!;
    public long BitRate { get; init; }
    public string Path { get; set; } = default!;
    public string WebUrl { get; set; } = default!;
    public DateTimeOffset? Created { get; set; }
    public DateTimeOffset? Modified { get; set; }
}
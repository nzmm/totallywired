using TotallyWired.Domain.Enums;

namespace TotallyWired.Models;

public class SourceModel
{
    public Guid Id { get; set; }
    public SourceType SourceType { get; set; }
    public string Name { get; set; } = default!;
    public DateTime CreatedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public int TrackCount { get; set; }
}

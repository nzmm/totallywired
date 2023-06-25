using TotallyWired.Domain.Enums;

namespace TotallyWired.Models;

public class SourceListModel
{
    public Guid SourceId { get; set; }
    public SourceType SourceType { get; set; }
    public int TrackCount { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
}

public class SourceTypeListModel
{
    public SourceType SourceType { get; init; }

    public IEnumerable<SourceListModel> Providers { get; set; } = Array.Empty<SourceListModel>();
}


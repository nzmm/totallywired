using TotallyWired.Domain.Enums;

namespace TotallyWired.Models;

public class SourceListModel
{
    public Guid Id { get; set; }
    public SourceType SourceType { get; set; }
    public int TrackCount { get; set; }
}

public class SourceGroupListModel
{
    public string GroupName { get; init; } = default!;

    public IEnumerable<SourceListModel> ContentProviders { get; set; } =
        Array.Empty<SourceListModel>();
}

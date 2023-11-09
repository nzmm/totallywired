namespace TotallyWired.Models;

public class SourceGroupListModel
{
    public string GroupName { get; init; } = default!;

    public IEnumerable<SourceModel> ContentProviders { get; set; } = Array.Empty<SourceModel>();
}

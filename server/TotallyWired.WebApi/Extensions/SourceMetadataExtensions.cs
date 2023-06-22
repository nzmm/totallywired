using TotallyWired.Domain.Enums;
using TotallyWired.Models;

namespace TotallyWired.WebApi.Extensions;

public class SourceMetadata
{
    public SourceType SourceType { get; init; }
    public string DisplayName { get; init; } = default!;
    public string RedirectUrl { get; init; } = default!;
}

public class SourceListItemMetadata : SourceTypeListModel
{
    public SourceListItemMetadata(SourceTypeListModel li, SourceMetadata m)
    {
        SourceType = m.SourceType;
        Sources = li.Sources;
        DisplayName = m.DisplayName;
        RedirectUrl = m.RedirectUrl;
    }
    
    public string DisplayName { get; }
    public string RedirectUrl { get; }
}

public static class SourceMetadataCollectionExtensions
{
    private static readonly IDictionary<SourceType, SourceMetadata> Metadata = new Dictionary<SourceType, SourceMetadata>
    {
        [SourceType.MicrosoftGraph] = new()
        {
            SourceType = SourceType.MicrosoftGraph,
            DisplayName = "Microsoft OneDrive",
            RedirectUrl = "/sources/begin-auth-msgraph"
        },
        
        [SourceType.GoogleDrive] = new()
        {
            SourceType = SourceType.GoogleDrive,
            DisplayName = "Google Drive #todo",
            RedirectUrl = "/sources/begin-auth-gdrive"
        },
        
        [SourceType.Dropbox] = new()
        {
            SourceType = SourceType.Dropbox,
            DisplayName = "Dropbox #todo",
            RedirectUrl = "/sources/begin-auth-dropbox"
        }
    };

    public static IEnumerable<SourceListItemMetadata> WithMetadata(this IEnumerable<SourceTypeListModel> items)
    {
        return items.Select(li => new SourceListItemMetadata(li, Metadata[li.SourceType]));
    }
}
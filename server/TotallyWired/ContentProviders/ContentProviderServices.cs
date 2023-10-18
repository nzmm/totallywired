using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;

namespace TotallyWired.ContentProviders;

public class ContentProviderServices(ContentProviderRegistry registry, IServiceProvider services)
{
    public ContentProvider? GetProvider(string providerName)
    {
        var exists = registry.RegisteredServiceProviders.TryGetValue(
            providerName.ToLowerInvariant(),
            out var providerServices
        );
        if (!exists)
        {
            throw new ApplicationException($"Content provider {providerName} not found");
        }
        return new ContentProvider(providerServices!, services);
    }

    public ContentProvider? GetProvider(SourceType type)
    {
        var providerName = Enum.GetName(type);
        if (string.IsNullOrEmpty(providerName))
        {
            throw new ArgumentException("Invalid source type");
        }
        return GetProvider(providerName);
    }
}

public class ContentProvider(
    IContentProviderServiceProvider providerServices,
    IServiceProvider services
)
{
    public string AuthorizationUri => providerServices.GetAuthorizeUri();

    public Task<bool> AuthorizeAsync(string code) =>
        providerServices.AuthorizeAsync(services, code);

    public IContentIndexer Indexer => providerServices.GetIndexer(services);

    public IContentRetriever<string> ReleaseArt =>
        providerServices.GetReleaseArtRetriever(services);

    public IContentRetriever<string> TrackDownload =>
        providerServices.GetTrackDownloadRetriever(services);
}

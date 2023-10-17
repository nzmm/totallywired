using Microsoft.Extensions.DependencyInjection;
using TotallyWired.ContentProviders.MicrosoftGraph.Internal;
using TotallyWired.ContentProviders.OAuth;
using TotallyWired.Contracts;

namespace TotallyWired.ContentProviders.MicrosoftGraph;

public class MicrosoftGraphContentProvider(MicrosoftGraphContentProviderOptions options)
    : IContentProvider
{
    public string Name => "Microsoft";
    public bool Enabled => options.Enabled;

    public string GetAuthorizeUri() => OAuthUriHelper.GetAuthorizeUri(options);

    public async Task<bool> AuthorizeAsync(IServiceProvider services, string code)
    {
        var tokenProvider = services.GetRequiredService<MicrosoftGraphTokenProvider>();
        var source = await tokenProvider.RetrieveAndStoreTokensAsync(code);
        return source.Id != default;
    }

    public IContentIndexer GetIndexer(IServiceProvider services) =>
        services.GetRequiredService<MicrosoftGraphContentIndexer>();

    public IContentRetriever<string> GetReleaseArtRetriever(IServiceProvider services) =>
        services.GetRequiredService<MicrosoftGraphReleaseArtRetriever>();

    public IContentRetriever<string> GetTrackDownloadRetriever(IServiceProvider services) =>
        services.GetRequiredService<MicrosoftGraphTrackDownloadRetriever>();
}

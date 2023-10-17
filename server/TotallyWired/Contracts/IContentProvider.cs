namespace TotallyWired.Contracts;

public interface IContentProvider
{
    string Name { get; }
    bool Enabled { get; }
    string GetAuthorizeUri();
    Task<bool> AuthorizeAsync(IServiceProvider services, string code);
    IContentIndexer GetIndexer(IServiceProvider services);
    IContentRetriever<string> GetReleaseArtRetriever(IServiceProvider services);
    IContentRetriever<string> GetTrackDownloadRetriever(IServiceProvider services);
}

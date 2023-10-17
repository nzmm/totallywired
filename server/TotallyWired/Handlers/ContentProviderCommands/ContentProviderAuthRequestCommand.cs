using TotallyWired.ContentProviders;
using TotallyWired.Contracts;

namespace TotallyWired.Handlers.ContentProviderCommands;

public class ContentProviderAuthRequestHandler(RegisteredContentProviders registry)
    : IRequestHandler<string, string>
{
    public Task<string> HandleAsync(string providerName, CancellationToken cancellationToken)
    {
        var provider = registry.GetProvider(providerName);
        return Task.FromResult(provider.GetAuthorizeUri());
    }
}

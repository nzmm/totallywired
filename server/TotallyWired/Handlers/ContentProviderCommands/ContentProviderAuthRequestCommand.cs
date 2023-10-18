using TotallyWired.ContentProviders;
using TotallyWired.Contracts;

namespace TotallyWired.Handlers.ContentProviderCommands;

public class ContentProviderAuthRequestHandler(ContentProviderServices providers)
    : IRequestHandler<string, string>
{
    public string Handle(string providerName)
    {
        var provider = providers.GetProvider(providerName);
        return provider?.AuthorizationUri ?? string.Empty;
    }
}

using TotallyWired.ContentProviders;
using TotallyWired.Contracts;

namespace TotallyWired.Handlers.ContentProviderCommands;

public class ContentProviderAuthConfirmCommand
{
    public string ProviderName { get; set; } = default!;
    public string Code { get; set; } = default!;
}

public class ContentProviderAuthConfirmHandler(ContentProviderServices providers)
    : IAsyncRequestHandler<ContentProviderAuthConfirmCommand, bool>
{
    public async Task<bool> HandleAsync(
        ContentProviderAuthConfirmCommand request,
        CancellationToken cancellationToken
    )
    {
        var provider = providers.GetProvider(request.ProviderName);
        if (provider is null)
        {
            return false;
        }
        return await provider.AuthorizeAsync(request.Code);
    }
}

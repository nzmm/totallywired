using TotallyWired.ContentProviders;
using TotallyWired.Contracts;

namespace TotallyWired.Handlers.ContentProviderCommands;

public class ContentProviderAuthConfirmCommand
{
    public string ProviderName { get; set; } = default!;
    public string Code { get; set; } = default!;
}

public class ContentProviderAuthConfirmHandler(
    IServiceProvider services,
    RegisteredContentProviders registry
) : IRequestHandler<ContentProviderAuthConfirmCommand, bool>
{
    public Task<bool> HandleAsync(
        ContentProviderAuthConfirmCommand request,
        CancellationToken cancellationToken
    )
    {
        var provider = registry.GetProvider(request.ProviderName);
        return provider.AuthorizeAsync(services, request.Code);
    }
}

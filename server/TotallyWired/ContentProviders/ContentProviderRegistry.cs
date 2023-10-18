using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;

namespace TotallyWired.ContentProviders;

public class ContentProviderRegistry(IEnumerable<IContentProviderServiceProvider> serviceProviders)
{
    public readonly IDictionary<
        string,
        IContentProviderServiceProvider
    > RegisteredServiceProviders = serviceProviders.ToDictionary(
        x => x.Name.ToLowerInvariant(),
        x => x
    );
}

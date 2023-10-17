using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;

namespace TotallyWired.ContentProviders;

public class RegisteredContentProviders(IEnumerable<IContentProvider> enabledProviders)
{
    private readonly IDictionary<string, IContentProvider> _providersByName =
        enabledProviders.ToDictionary(x => x.Name.ToLowerInvariant(), x => x);

    public ICollection<string> GetEnabledProviders() => _providersByName.Keys;

    public IContentProvider GetProvider(string name) => _providersByName[name.ToLowerInvariant()];

    public IContentProvider GetProvider(SourceType type)
    {
        var name = Enum.GetName(type);
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException(nameof(name));
        }
        return _providersByName[name.ToLowerInvariant()];
    }
}

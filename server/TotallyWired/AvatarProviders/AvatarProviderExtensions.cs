using Microsoft.Extensions.DependencyInjection;
using TotallyWired.AvatarProviders.MicrosoftGraph;

namespace TotallyWired.AvatarProviders;

public static class AvatarProviderExtensions
{
    public static void AddAvatarProviders(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<MicrosoftAvatarRetriever>();
    }
}

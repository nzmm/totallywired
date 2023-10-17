using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TotallyWired.ContentProviders.MicrosoftGraph;
using TotallyWired.ContentProviders.GoogleDrive;
using TotallyWired.Contracts;
using TotallyWired.Handlers.ContentProviderCommands;

namespace TotallyWired.ContentProviders;

public static class ContentProviderExtensions
{
    private delegate IContentProvider ContentProviderFactory(
        IServiceCollection services,
        Action<object> configure
    );

    public static void AddContentProviders(
        this IServiceCollection serviceCollection,
        IConfiguration configuration
    )
    {
        // These are the list of content providers available to the application.
        var contentProviders = new Dictionary<string, ContentProviderFactory>
        {
            ["Google"] = static (services, configure) =>
                services.AddGoogleDriveContentProvider(configure),
            ["Microsoft"] = static (services, configure) =>
                services.AddMicrosoftGraphContentProvider(configure),
        };

        var enabledProviders = new List<IContentProvider>();
        foreach (var (providerName, providerFac) in contentProviders)
        {
            var section = configuration.GetSection($"ContentProviders:{providerName}");
            if (!section.Exists())
            {
                continue;
            }

            var provider = providerFac(
                serviceCollection,
                options =>
                {
                    section.Bind(options);
                }
            );

            if (provider.Enabled)
            {
                enabledProviders.Add(provider);
            }
        }

        serviceCollection.AddSingleton(new RegisteredContentProviders(enabledProviders));
        serviceCollection.AddTransient<ContentProviderAuthRequestHandler>();
        serviceCollection.AddTransient<ContentProviderAuthConfirmHandler>();
    }
}

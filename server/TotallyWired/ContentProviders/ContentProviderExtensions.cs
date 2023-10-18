using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TotallyWired.ContentProviders.MicrosoftGraph;
using TotallyWired.ContentProviders.GoogleDrive;
using TotallyWired.Contracts;
using TotallyWired.Handlers.ContentProviderCommands;

namespace TotallyWired.ContentProviders;

public static class ContentProviderExtensions
{
    private delegate IContentProviderServiceProvider ContentProviderFactory(
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

        var serviceProviders = new List<IContentProviderServiceProvider>();
        foreach (var (providerName, serviceProviderFactory) in contentProviders)
        {
            var section = configuration.GetSection($"ContentProviders:{providerName}");
            if (!section.Exists())
            {
                continue;
            }

            var serviceProvider = serviceProviderFactory(
                serviceCollection,
                options =>
                {
                    section.Bind(options);
                }
            );
            if (serviceProvider.Enabled)
            {
                serviceProviders.Add(serviceProvider);
            }
        }

        serviceCollection.AddSingleton(new ContentProviderRegistry(serviceProviders));
        serviceCollection.AddTransient<ContentProviderServices>();
        serviceCollection.AddTransient<ContentProviderAuthConfirmHandler>();
        serviceCollection.AddTransient<ContentProviderAuthConfirmHandler>();
    }
}

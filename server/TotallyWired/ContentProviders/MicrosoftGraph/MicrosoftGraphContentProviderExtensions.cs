using Microsoft.Extensions.DependencyInjection;
using TotallyWired.ContentProviders.MicrosoftGraph.Internal;
using TotallyWired.Contracts;

namespace TotallyWired.ContentProviders.MicrosoftGraph;

public static class MicrosoftGraphExtensions
{
    public static IContentProviderServiceProvider AddMicrosoftGraphContentProvider(
        this IServiceCollection services,
        Action<object> configureOptions
    )
    {
        var options = new MicrosoftGraphContentProviderOptions();
        configureOptions(options);

        if (!options.Enabled)
        {
            return new MicrosoftGraphContentProviderServiceProvider(options);
        }

        services.AddSingleton(options);
        services.AddScoped<MicrosoftGraphTokenProvider>();
        services.AddScoped<MicrosoftGraphClientProvider>();
        services.AddTransient<MicrosoftGraphContentIndexer>();
        services.AddTransient<MicrosoftGraphReleaseArtRetriever>();
        services.AddTransient<MicrosoftGraphTrackDownloadRetriever>();

        return new MicrosoftGraphContentProviderServiceProvider(options);
    }
}

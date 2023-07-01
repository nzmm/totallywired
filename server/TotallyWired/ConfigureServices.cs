using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Common;
using TotallyWired.ContentProviders.MicrosoftGraph;
using TotallyWired.Contracts;
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.Handlers.TrackQueries;

namespace TotallyWired;

public static class ConfigureServices
{
    public static void AddTotallyWiredHandlers(this IServiceCollection services)
    {
        services.AddSingleton<UtcProvider>();

        services.AddScoped<MicrosoftGraphOAuthUriHelper>();
        services.AddScoped<MicrosoftGraphTokenProvider>();
        services.AddScoped<MicrosoftGraphClientProvider>();
        
        // indexing
        services.AddTransient<ISourceIndexer, MicrosoftGraphSourceIndexer>();

        // tracks
        services.AddScoped<TrackListHandler>();
        services.AddScoped<TrackDownloadUrlHandler>();

        // releases
        services.AddScoped<ReleaseListHandler>();
        services.AddScoped<ReleaseThumbnailHandler>();
        
        // artists
        services.AddScoped<ArtistListHandler>();
        
        // providers
        services.AddScoped<SourceListHandler>();
        services.AddScoped<SourceSyncHandler>();

        //return services;
    }
}
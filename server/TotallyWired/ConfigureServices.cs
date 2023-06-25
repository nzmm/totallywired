using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.Handlers.TrackQueries;

namespace TotallyWired;

public static class ConfigureServices
{
    public static IServiceCollection AddTotallyWiredHandlers(this IServiceCollection services)
    {
        // tracks
        services.AddScoped<TrackListHandler>();
        services.AddScoped<TrackDownloadUrlHandler>();

        // providers
        services.AddScoped<SourceListHandler>();
        services.AddScoped<SourceSyncHandler>();

        return services;
    }
}
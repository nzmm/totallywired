using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Handlers.TrackQueries;

namespace TotallyWired;

public static class ConfigureServices
{
    public static IServiceCollection AddTotallyWiredHandlers(this IServiceCollection services)
    {
        services.AddScoped<TrackListHandler>();
        services.AddScoped<TrackListHandler>();

        return services;
    }
}
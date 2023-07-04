using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Common;
using TotallyWired.Contracts;
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired;

public static class ConfigureServices
{
    public static void AddCoreServices(this IServiceCollection services, IConfiguration config)
    {
        // system
        services.AddSingleton<UtcProvider>();

        // data
        var connectionString = config.GetConnectionString("Postgres") ?? throw new ArgumentNullException();
        services.AddDbContext<TotallyWiredDbContext>(opts =>
        {
            opts.UseNpgsql(connectionString);
            //opts.EnableSensitiveDataLogging();
        });
        
        // indexing
        services.AddScoped<MicrosoftGraphOAuthUriHelper>();
        services.AddScoped<MicrosoftGraphTokenProvider>();
        services.AddScoped<MicrosoftGraphClientProvider>();
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
    }
}
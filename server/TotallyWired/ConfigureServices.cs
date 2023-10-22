using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Contracts;
using TotallyWired.Common;
using TotallyWired.ContentProviders;
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Handlers.PlaylistQueries;
using TotallyWired.Handlers.ReleaseCommands;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.Handlers.TrackCommands;
using TotallyWired.Handlers.TrackQueries;

namespace TotallyWired;

public static class ConfigureServices
{
    public static void AddCoreServices(this IServiceCollection services, IConfiguration config)
    {
        // common
        services.AddSingleton<ITimeProvider>(new SystemTimeProvider());

        // database
        var connectionString =
            config.GetConnectionString("Postgres") ?? throw new ArgumentNullException("Postgres");

        services.AddDbContext<TotallyWiredDbContext>(opts =>
        {
            opts.UseNpgsql(connectionString);
            //opts.EnableSensitiveDataLogging();
        });

        // content providers
        services.AddContentProviders(config);

        // tracks
        services.AddScoped<TrackQueryHandler>();
        services.AddScoped<TrackListQueryHandler>();
        services.AddScoped<TrackRandomListQueryHandler>();
        services.AddScoped<TrackDownloadQueryHandler>();
        services.AddScoped<TrackReactionCommandHandler>();

        // releases
        services.AddScoped<ReleaseQueryHandler>();
        services.AddScoped<ReleaseListQueryHandler>();
        services.AddScoped<ReleaseArtQueryHandler>();
        services.AddScoped<UpdateReleaseMetadataCommandHandler>();
        services.AddScoped<ReleaseCollectionsQueryHandler>();

        // artists
        services.AddScoped<ArtistQueryHandler>();
        services.AddScoped<ArtistListQueryHandler>();
        services.AddScoped<ArtistArtQueryHandler>();

        // playlists
        services.AddScoped<PlaylistListQueryHandler>();

        // sources
        services.AddScoped<SourceListQueryHandler>();
        services.AddScoped<SourceQueryHandler>();
        services.AddScoped<SourceSyncCommandHandler>();
    }

    public static void PrepareDatabase(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TotallyWiredDbContext>();
        db.Database.Migrate();
    }
}

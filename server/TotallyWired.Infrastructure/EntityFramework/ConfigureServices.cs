using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TotallyWired.Infrastructure.EntityFramework;

public static class ConfigureServices
{
    public static void AddTotallyWiredDataStores(this IServiceCollection services, IConfiguration config)
    {
        var connectionString = config.GetConnectionString("Postgres") ?? throw new ArgumentNullException();
        services.AddDbContext<TotallyWiredDbContext>(opts =>
        {
            opts.UseNpgsql(connectionString);
            //opts.EnableSensitiveDataLogging();
        });
    }
}
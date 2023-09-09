using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using TotallyWired.Infrastructure.EntityFramework;

namespace DbMigrator;

public class TotallyWiredDbContextFactory : IDesignTimeDbContextFactory<TotallyWiredDbContext>
{
    public TotallyWiredDbContext CreateDbContext(string[] _)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var connectionString = configuration.GetConnectionString("Postgres");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new ValidationException("A connection string must be provided");
        }

        Console.WriteLine($"Migration design time connection string: '{connectionString}'");

        var optionsBuilder = new DbContextOptionsBuilder<TotallyWiredDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TotallyWiredDbContext(optionsBuilder.Options);
    }
}

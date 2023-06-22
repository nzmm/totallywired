using System.Reflection;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TotallyWired.Infrastructure.EntityFramework.Extensions;

internal static class MigrationBuilderExtensions
{
    private const string PostgreSqlNamespace = "TotallyWired.Infrastructure.EntityFramework.PostgreSQL";
    
    internal static void ScriptMigration(this MigrationBuilder migrationBuilder, string ns, string fn)
    {
        if (string.IsNullOrEmpty(ns))
        {
            throw new ArgumentException("A script namespace must be provided", nameof(ns));
        }

        if (string.IsNullOrEmpty(fn))
        {
            throw new ArgumentException("A script filename must be provided", nameof(fn));
        }
        
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = string.Join(".", PostgreSqlNamespace, ns, fn);

        Console.WriteLine("\n *** \n");
        Console.WriteLine($"Attempting migration with '{resourceName}'... \n");
        
        var validResources = assembly.GetManifestResourceNames();
        if (!validResources.Contains(resourceName))
        {
            throw new FileNotFoundException("Embedded resource not found", resourceName);
        }

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream is null)
        {
            throw new FileLoadException("Failed to load manifest resource stream from assembly", resourceName);
        }

        using var reader = new StreamReader(stream);
        
        var script = reader.ReadToEnd();

        Console.WriteLine(script);
        Console.WriteLine("\n***\n");
        
        migrationBuilder.Sql(script);
    }

    internal static void DropProcedure(this MigrationBuilder migrationBuilder, string procedureName)
    {
        if (string.IsNullOrEmpty(procedureName))
        {
            throw new ArgumentException("A procedure name must be provided", nameof(procedureName));
        }
        
        migrationBuilder.Sql($"DROP PROCEDURE IF EXISTS {procedureName};");
    }

    internal static void DropTriggers(this MigrationBuilder migrationBuilder, string triggerName, string[] tableNames)
    {
        if (!tableNames.Any() || tableNames.Any(string.IsNullOrEmpty))
        {
            throw new ArgumentException("At least one table name must be provided", nameof(tableNames));
        }
        if (string.IsNullOrEmpty(triggerName))
        {
            throw new ArgumentException("A trigger name must be provided", nameof(triggerName));
        }

        foreach (var tableName in tableNames)
        {
            migrationBuilder.Sql($"DROP TRIGGER IF EXISTS {triggerName} ON {tableName};");   
        }
    }
}
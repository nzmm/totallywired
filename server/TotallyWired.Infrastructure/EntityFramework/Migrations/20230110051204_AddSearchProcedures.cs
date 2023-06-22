using Microsoft.EntityFrameworkCore.Migrations;
using TotallyWired.Infrastructure.EntityFramework.Extensions;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class AddSearchProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.ScriptMigration(
                $"Functions",
                "search_tracks.0.sql");
            
            migrationBuilder.ScriptMigration(
                $"Functions",
                "search_releases.0.sql");
            
            migrationBuilder.ScriptMigration(
                $"Functions",
                "search_artists.0.sql");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropProcedure("search_tracks");
            migrationBuilder.DropProcedure("search_releases");
            migrationBuilder.DropProcedure("search_artists");
        }
    }
}
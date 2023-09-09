using Microsoft.EntityFrameworkCore.Migrations;
using TotallyWired.Infrastructure.EntityFramework.Extensions;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class AddModTimeTriggers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.ScriptMigration($"Functions", "update_modified_column.0.sql");

            migrationBuilder.ScriptMigration($"Triggers", "auto_update_modtime.0.sql");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTriggers(
                "auto_update_modtime",
                new[] { "Artists", "Releases", "Sources", "TrackReactions", "Tracks", "Users" }
            );

            migrationBuilder.DropProcedure("update_modified_column");
        }
    }
}

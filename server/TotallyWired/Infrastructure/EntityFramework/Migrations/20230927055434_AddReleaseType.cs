using Microsoft.EntityFrameworkCore.Migrations;
using TotallyWired.Infrastructure.EntityFramework.Extensions;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class AddReleaseType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Releases",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.ScriptMigration("Functions", "search_releases.1.sql");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Type", table: "Releases");
            migrationBuilder.ScriptMigration("Functions", "search_releases.0.sql");
        }
    }
}

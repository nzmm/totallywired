using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class AddSourceName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Sources",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Sources");
        }
    }
}

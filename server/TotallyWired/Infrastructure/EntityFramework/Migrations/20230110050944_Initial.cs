using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        IdentityId = table.Column<string>(type: "text", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(500)",
                            maxLength: 500,
                            nullable: false
                        ),
                        UserName = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        Email = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        ThumbnailUrl = table.Column<string>(
                            type: "character varying(4000)",
                            maxLength: 4000,
                            nullable: false
                        )
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "Artists",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        UserId = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        Name = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        Description = table.Column<string>(type: "text", nullable: false),
                        ThumbnailUrl = table.Column<string>(
                            type: "character varying(4000)",
                            maxLength: 4000,
                            nullable: false
                        ),
                        MusicBrainzId = table.Column<string>(
                            type: "character varying(200)",
                            maxLength: 200,
                            nullable: false,
                            defaultValue: ""
                        ),
                        SearchVectorEN = table
                            .Column<NpgsqlTsVector>(
                                name: "SearchVector_EN",
                                type: "tsvector",
                                nullable: false
                            )
                            .Annotation("Npgsql:TsVectorConfig", "simple")
                            .Annotation("Npgsql:TsVectorProperties", new[] { "Name" })
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artists", x => new { x.Id, x.UserId });
                    table.ForeignKey(
                        name: "FK_Artist_User",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "Sources",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        UserId = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        Type = table.Column<int>(type: "integer", nullable: false),
                        AccessToken = table.Column<string>(type: "text", nullable: false),
                        RefreshToken = table.Column<string>(type: "text", nullable: false),
                        ExpiresAt = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false
                        ),
                        Delta = table.Column<string>(type: "text", nullable: false)
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sources", x => new { x.Id, x.UserId });
                    table.ForeignKey(
                        name: "FK_Source_User",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "Releases",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        UserId = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        ArtistId = table.Column<Guid>(type: "uuid", nullable: false),
                        ResourceId = table.Column<string>(type: "text", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(100)",
                            maxLength: 100,
                            nullable: false
                        ),
                        ThumbnailUrl = table.Column<string>(
                            type: "character varying(4000)",
                            maxLength: 4000,
                            nullable: false
                        ),
                        Year = table.Column<int>(type: "integer", nullable: true),
                        Country = table.Column<string>(
                            type: "character varying(8)",
                            maxLength: 8,
                            nullable: false,
                            defaultValue: ""
                        ),
                        RecordLabel = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false,
                            defaultValue: ""
                        ),
                        MusicBrainzId = table.Column<string>(
                            type: "character varying(200)",
                            maxLength: 200,
                            nullable: false,
                            defaultValue: ""
                        ),
                        SearchVectorEN = table
                            .Column<NpgsqlTsVector>(
                                name: "SearchVector_EN",
                                type: "tsvector",
                                nullable: false
                            )
                            .Annotation("Npgsql:TsVectorConfig", "simple")
                            .Annotation("Npgsql:TsVectorProperties", new[] { "Name" })
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Releases", x => new { x.Id, x.UserId });
                    table.ForeignKey(
                        name: "FK_Release_Artist",
                        columns: x => new { x.ArtistId, x.UserId },
                        principalTable: "Artists",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Release_User",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        UserId = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        SourceId = table.Column<Guid>(type: "uuid", nullable: false),
                        ArtistId = table.Column<Guid>(type: "uuid", nullable: false),
                        ReleaseId = table.Column<Guid>(type: "uuid", nullable: false),
                        ResourceId = table.Column<string>(type: "text", nullable: false),
                        Disc = table.Column<int>(type: "integer", nullable: false),
                        Position = table.Column<int>(type: "integer", nullable: false),
                        Number = table.Column<string>(
                            type: "character varying(8)",
                            maxLength: 8,
                            nullable: false
                        ),
                        FileName = table.Column<string>(type: "text", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        ReleaseName = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        ArtistCredit = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        Genre = table.Column<string>(
                            type: "character varying(1000)",
                            maxLength: 1000,
                            nullable: false
                        ),
                        ThumbnailUrl = table.Column<string>(
                            type: "character varying(4000)",
                            maxLength: 4000,
                            nullable: false
                        ),
                        Year = table.Column<int>(type: "integer", nullable: false),
                        MusicBrainzId = table.Column<string>(
                            type: "character varying(200)",
                            maxLength: 200,
                            nullable: false,
                            defaultValue: ""
                        ),
                        BitRate = table.Column<long>(type: "bigint", nullable: false),
                        Length = table.Column<long>(type: "bigint", nullable: false),
                        DisplayLength = table.Column<string>(
                            type: "character varying(20)",
                            maxLength: 20,
                            nullable: false
                        ),
                        SearchVectorEN = table
                            .Column<NpgsqlTsVector>(
                                name: "SearchVector_EN",
                                type: "tsvector",
                                nullable: false
                            )
                            .Annotation("Npgsql:TsVectorConfig", "simple")
                            .Annotation("Npgsql:TsVectorProperties", new[] { "Name" })
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => new { x.Id, x.UserId });
                    table.ForeignKey(
                        name: "FK_Track_Artist",
                        columns: x => new { x.ArtistId, x.UserId },
                        principalTable: "Artists",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Track_Release",
                        columns: x => new { x.ReleaseId, x.UserId },
                        principalTable: "Releases",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Track_Source",
                        columns: x => new { x.SourceId, x.UserId },
                        principalTable: "Sources",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Track_User",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "TrackReactions",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        UserId = table.Column<Guid>(type: "uuid", nullable: false),
                        Created = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false,
                            defaultValueSql: "now()"
                        ),
                        Modified = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        TrackId = table.Column<Guid>(type: "uuid", nullable: false),
                        Reaction = table.Column<int>(type: "integer", nullable: false)
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackReactions", x => new { x.Id, x.UserId });
                    table.ForeignKey(
                        name: "FK_Reaction_User",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Track_Reactions",
                        columns: x => new { x.TrackId, x.UserId },
                        principalTable: "Tracks",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder
                .CreateIndex(
                    name: "IX_Artists_SearchVector_EN",
                    table: "Artists",
                    column: "SearchVector_EN"
                )
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Artists_UserId",
                table: "Artists",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Releases_ArtistId_UserId",
                table: "Releases",
                columns: new[] { "ArtistId", "UserId" }
            );

            migrationBuilder
                .CreateIndex(
                    name: "IX_Releases_SearchVector_EN",
                    table: "Releases",
                    column: "SearchVector_EN"
                )
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Releases_UserId",
                table: "Releases",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Sources_UserId",
                table: "Sources",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_TrackReactions_TrackId",
                table: "TrackReactions",
                column: "TrackId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_TrackReactions_TrackId_UserId",
                table: "TrackReactions",
                columns: new[] { "TrackId", "UserId" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_TrackReactions_UserId",
                table: "TrackReactions",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_ArtistId_UserId",
                table: "Tracks",
                columns: new[] { "ArtistId", "UserId" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_ReleaseId_UserId",
                table: "Tracks",
                columns: new[] { "ReleaseId", "UserId" }
            );

            migrationBuilder
                .CreateIndex(
                    name: "IX_Tracks_SearchVector_EN",
                    table: "Tracks",
                    column: "SearchVector_EN"
                )
                .Annotation("Npgsql:IndexMethod", "GIN");

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_SourceId_UserId",
                table: "Tracks",
                columns: new[] { "SourceId", "UserId" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_UserId",
                table: "Tracks",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "TrackReactions");

            migrationBuilder.DropTable(name: "Tracks");

            migrationBuilder.DropTable(name: "Releases");

            migrationBuilder.DropTable(name: "Sources");

            migrationBuilder.DropTable(name: "Artists");

            migrationBuilder.DropTable(name: "Users");
        }
    }
}

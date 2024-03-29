﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using NpgsqlTypes;
using TotallyWired.Infrastructure.EntityFramework;

#nullable disable

namespace TotallyWired.Infrastructure.EntityFramework.Migrations
{
    [DbContext(typeof(TotallyWiredDbContext))]
    [Migration("20230110051059_AddModTimeTriggers")]
    partial class AddModTimeTriggers
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("TotallyWired.Domain.Entities.Artist", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("MusicBrainzId")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasDefaultValue("");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<NpgsqlTsVector>("SearchVector_EN")
                        .IsRequired()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("tsvector")
                        .HasAnnotation("Npgsql:TsVectorConfig", "simple")
                        .HasAnnotation("Npgsql:TsVectorProperties", new[] { "Name" });

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.HasKey("Id", "UserId");

                    b.HasIndex("SearchVector_EN");

                    NpgsqlIndexBuilderExtensions.HasMethod(b.HasIndex("SearchVector_EN"), "GIN");

                    b.HasIndex("UserId");

                    b.ToTable("Artists");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Release", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ArtistId")
                        .HasColumnType("uuid");

                    b.Property<string>("Country")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(8)
                        .HasColumnType("character varying(8)")
                        .HasDefaultValue("");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("MusicBrainzId")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasDefaultValue("");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("RecordLabel")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)")
                        .HasDefaultValue("");

                    b.Property<string>("ResourceId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<NpgsqlTsVector>("SearchVector_EN")
                        .IsRequired()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("tsvector")
                        .HasAnnotation("Npgsql:TsVectorConfig", "simple")
                        .HasAnnotation("Npgsql:TsVectorProperties", new[] { "Name" });

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.Property<int?>("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id", "UserId");

                    b.HasIndex("SearchVector_EN");

                    NpgsqlIndexBuilderExtensions.HasMethod(b.HasIndex("SearchVector_EN"), "GIN");

                    b.HasIndex("UserId");

                    b.HasIndex("ArtistId", "UserId");

                    b.ToTable("Releases");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Source", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("AccessToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<string>("Delta")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("Sources");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Track", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<string>("ArtistCredit")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<Guid>("ArtistId")
                        .HasColumnType("uuid");

                    b.Property<long>("BitRate")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<int>("Disc")
                        .HasColumnType("integer");

                    b.Property<string>("DisplayLength")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Genre")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<long>("Length")
                        .HasColumnType("bigint");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("MusicBrainzId")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasDefaultValue("");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasMaxLength(8)
                        .HasColumnType("character varying(8)");

                    b.Property<int>("Position")
                        .HasColumnType("integer");

                    b.Property<Guid>("ReleaseId")
                        .HasColumnType("uuid");

                    b.Property<string>("ReleaseName")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("ResourceId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<NpgsqlTsVector>("SearchVector_EN")
                        .IsRequired()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("tsvector")
                        .HasAnnotation("Npgsql:TsVectorConfig", "simple")
                        .HasAnnotation("Npgsql:TsVectorProperties", new[] { "Name" });

                    b.Property<Guid>("SourceId")
                        .HasColumnType("uuid");

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.Property<int>("Year")
                        .HasColumnType("integer");

                    b.HasKey("Id", "UserId");

                    b.HasIndex("SearchVector_EN");

                    NpgsqlIndexBuilderExtensions.HasMethod(b.HasIndex("SearchVector_EN"), "GIN");

                    b.HasIndex("UserId");

                    b.HasIndex("ArtistId", "UserId");

                    b.HasIndex("ReleaseId", "UserId");

                    b.HasIndex("SourceId", "UserId");

                    b.ToTable("Tracks");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.TrackReaction", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Reaction")
                        .HasColumnType("integer");

                    b.Property<Guid>("TrackId")
                        .HasColumnType("uuid");

                    b.HasKey("Id", "UserId");

                    b.HasIndex("TrackId");

                    b.HasIndex("UserId");

                    b.HasIndex("TrackId", "UserId");

                    b.ToTable("TrackReactions");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Created")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("IdentityId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("Modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Artist", b =>
                {
                    b.HasOne("TotallyWired.Domain.Entities.User", "User")
                        .WithMany("Artists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Artist_User");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Release", b =>
                {
                    b.HasOne("TotallyWired.Domain.Entities.User", "User")
                        .WithMany("Releases")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Release_User");

                    b.HasOne("TotallyWired.Domain.Entities.Artist", "Artist")
                        .WithMany("Releases")
                        .HasForeignKey("ArtistId", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Release_Artist");

                    b.Navigation("Artist");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Source", b =>
                {
                    b.HasOne("TotallyWired.Domain.Entities.User", "User")
                        .WithMany("Sources")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Source_User");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Track", b =>
                {
                    b.HasOne("TotallyWired.Domain.Entities.User", "User")
                        .WithMany("Tracks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Track_User");

                    b.HasOne("TotallyWired.Domain.Entities.Artist", "Artist")
                        .WithMany("Tracks")
                        .HasForeignKey("ArtistId", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Track_Artist");

                    b.HasOne("TotallyWired.Domain.Entities.Release", "Release")
                        .WithMany("Tracks")
                        .HasForeignKey("ReleaseId", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Track_Release");

                    b.HasOne("TotallyWired.Domain.Entities.Source", "Source")
                        .WithMany("Tracks")
                        .HasForeignKey("SourceId", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Track_Source");

                    b.Navigation("Artist");

                    b.Navigation("Release");

                    b.Navigation("Source");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.TrackReaction", b =>
                {
                    b.HasOne("TotallyWired.Domain.Entities.User", "User")
                        .WithMany("TrackReactions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Reaction_User");

                    b.HasOne("TotallyWired.Domain.Entities.Track", "Track")
                        .WithMany("Reactions")
                        .HasForeignKey("TrackId", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_Track_Reactions");

                    b.Navigation("Track");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Artist", b =>
                {
                    b.Navigation("Releases");

                    b.Navigation("Tracks");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Release", b =>
                {
                    b.Navigation("Tracks");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Source", b =>
                {
                    b.Navigation("Tracks");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.Track", b =>
                {
                    b.Navigation("Reactions");
                });

            modelBuilder.Entity("TotallyWired.Domain.Entities.User", b =>
                {
                    b.Navigation("Artists");

                    b.Navigation("Releases");

                    b.Navigation("Sources");

                    b.Navigation("TrackReactions");

                    b.Navigation("Tracks");
                });
#pragma warning restore 612, 618
        }
    }
}

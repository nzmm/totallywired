using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class TrackConfiguration : IEntityTypeConfiguration<Track>
{
    public void Configure(EntityTypeBuilder<Track> builder)
    {
        builder.HasKey(x => new { x.Id, x.UserId });

        builder.Property(x => x.Created).HasDefaultValueSql("now()");

        builder.Property(x => x.Number).IsRequired().HasMaxLength(8);

        builder.Property(x => x.ThumbnailUrl).HasMaxLength(4000);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(1000);

        builder.Property(x => x.ReleaseName).HasMaxLength(1000);

        builder.Property(x => x.ArtistCredit).HasMaxLength(1000);

        builder.Property(x => x.Genre).HasMaxLength(1000);

        builder.Property(x => x.DisplayLength).IsRequired().HasMaxLength(20);

        builder.Property(x => x.MusicBrainzId).HasDefaultValue("").HasMaxLength(200);

        builder
            .HasGeneratedTsVectorColumn(p => p.SearchVector_EN, "simple", p => new { p.Name })
            .HasIndex(p => p.SearchVector_EN)
            .HasMethod("GIN");

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Tracks)
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_Track_User");

        builder
            .HasOne(x => x.Source)
            .WithMany(x => x.Tracks)
            .HasForeignKey(x => new { x.SourceId, x.UserId })
            .HasConstraintName("FK_Track_Source");

        builder
            .HasOne(x => x.Artist)
            .WithMany(x => x.Tracks)
            .HasForeignKey(x => new { x.ArtistId, x.UserId })
            .HasConstraintName("FK_Track_Artist");

        builder
            .HasOne(x => x.Release)
            .WithMany(x => x.Tracks)
            .HasForeignKey(x => new { x.ReleaseId, x.UserId })
            .HasConstraintName("FK_Track_Release");
    }
}

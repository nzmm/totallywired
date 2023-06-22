using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class ArtistConfiguration : IEntityTypeConfiguration<Artist>
{
    public void Configure(EntityTypeBuilder<Artist> builder)
    {
        builder.HasKey(x => new { x.Id, x.UserId });

        builder
            .Property(x => x.Created)
            .HasDefaultValueSql("now()");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(1000);
        
        builder
            .Property(x => x.ThumbnailUrl)
            .HasMaxLength(4000);
        
        builder
            .Property(x => x.MusicBrainzId)
            .HasDefaultValue("")
            .HasMaxLength(200);
        
        builder
            .HasGeneratedTsVectorColumn(
                p => p.SearchVector_EN,
                "simple",
                p => new { p.Name })
            .HasIndex(p => p.SearchVector_EN)
            .HasMethod("GIN");
        
        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Artists)
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_Artist_User");
    }
}
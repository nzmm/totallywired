using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class ReleaseConfiguration : IEntityTypeConfiguration<Release>
{
    public void Configure(EntityTypeBuilder<Release> builder)
    {
        builder.HasKey(x => new { x.Id, x.UserId });
    
        builder
            .Property(x => x.Created)
            .HasDefaultValueSql("now()");
        
        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(x => x.ThumbnailUrl)
            .HasMaxLength(4000);
        
        builder
            .Property(x => x.RecordLabel)
            .HasDefaultValue("")
            .HasMaxLength(1000);
        
        builder
            .Property(x => x.Country)
            .HasDefaultValue("")
            .HasMaxLength(8);
        
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
            .WithMany(x => x.Releases)
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_Release_User");
        
        builder
            .HasOne(x => x.Artist)
            .WithMany(x => x.Releases)
            .HasForeignKey(x => new { x.ArtistId, x.UserId })
            .HasConstraintName("FK_Release_Artist");
    }
}
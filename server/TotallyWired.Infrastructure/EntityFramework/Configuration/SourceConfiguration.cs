using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class SourceConfiguration : IEntityTypeConfiguration<Source>
{
    public void Configure(EntityTypeBuilder<Source> builder)
    {
        builder.HasKey(x => new { x.Id, x.UserId });

        builder
            .Property(x => x.Created)
            .HasDefaultValueSql("now()");
        
        builder
            .Property(x => x.Type)
            .IsRequired();

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Sources)
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_Source_User");
    }
}
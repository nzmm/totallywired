using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.UserName).IsUnique();

        builder.Property(x => x.Created).HasDefaultValueSql("now()");

        builder.Property(x => x.Name).HasMaxLength(500).IsRequired();

        builder.Property(x => x.UserName).HasMaxLength(1000).IsRequired();

        builder.Property(x => x.Email).HasMaxLength(1000);

        builder.Property(x => x.ThumbnailUrl).HasMaxLength(4000);
    }
}

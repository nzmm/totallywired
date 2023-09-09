using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework.Configuration;

public class TrackReactionConfiguration : IEntityTypeConfiguration<TrackReaction>
{
    public void Configure(EntityTypeBuilder<TrackReaction> builder)
    {
        builder.HasKey(x => new { x.Id, x.UserId });

        builder.HasIndex(x => x.TrackId);

        builder.Property(x => x.Created).HasDefaultValueSql("now()");

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.TrackReactions)
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_Reaction_User");

        builder
            .HasOne(x => x.Track)
            .WithMany(x => x.Reactions)
            .HasForeignKey(x => new { x.TrackId, x.UserId })
            .HasConstraintName("FK_Track_Reactions");
    }
}

using Microsoft.EntityFrameworkCore;
using TotallyWired.Domain.Entities;

namespace TotallyWired.Infrastructure.EntityFramework;

public class TotallyWiredDbContext : DbContext
{
    public virtual DbSet<User> Users { get; set; } = default!;
    public virtual DbSet<Source> Sources { get; set; } = default!;
    public virtual DbSet<Artist> Artists { get; set; } = default!;
    public virtual DbSet<Release> Releases { get; set; } = default!;
    public virtual DbSet<Track> Tracks { get; set; } = default!;
    public virtual DbSet<TrackReaction> TrackReactions { get; set; } = default!;

    public TotallyWiredDbContext(DbContextOptions<TotallyWiredDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TotallyWiredDbContext).Assembly);
    }
}
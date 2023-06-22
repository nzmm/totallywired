using NpgsqlTypes;
using TotallyWired.Domain.Contracts;

// ReSharper disable InconsistentNaming

namespace TotallyWired.Domain.Entities;

public class Artist : IUserSpecific
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    
    public Guid UserId { get; set; }

    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string ThumbnailUrl { get; set; } = default!;
    public string MusicBrainzId { get; set; } = default!;
    
    public NpgsqlTsVector SearchVector_EN { get; set; } = default!;
    
    public virtual User User { get; set; } = default!;
    
    public virtual ICollection<Release> Releases { get; set; } = default!;
    public virtual ICollection<Track> Tracks { get; set; } = default!;
}
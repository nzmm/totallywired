using NpgsqlTypes;
using TotallyWired.Domain.Contracts;

// ReSharper disable InconsistentNaming

namespace TotallyWired.Domain.Entities;

public class Release : IUserSpecific
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    
    public Guid UserId { get; set; }
    public Guid ArtistId { get; set; }
    public string ResourceId { get; set; } = default!;
    
    public string Name { get; set; } = default!;
    public string ThumbnailUrl { get; set; } = default!;
    public int? Year { get; set; }
    public string Country { get; set; } = default!;
    public string RecordLabel { get; set; } = default!;
    public string MusicBrainzId { get; set; } = default!;
    
    public NpgsqlTsVector SearchVector_EN { get; set; } = default!;

    public virtual User User { get; set; } = default!;
    public virtual Artist Artist { get; set; } = default!;
    
    public virtual ICollection<Track> Tracks { get; set; } = default!;
}
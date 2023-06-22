using NpgsqlTypes;
using TotallyWired.Domain.Contracts;

// ReSharper disable InconsistentNaming

namespace TotallyWired.Domain.Entities;

public class Track : IUserSpecific, ISourceSpecific
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    
    public Guid UserId { get; set; }
    public Guid SourceId { get; set; }
    public Guid ArtistId { get; set; }
    public Guid ReleaseId { get; set; }

    public string ResourceId { get; set; } = default!;
    public int Disc { get; set; }
    public int Position { get; set; }
    public string Number { get; set; } = default!;
    public string FileName { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string ReleaseName { get; set; } = default!;
    public string ArtistCredit { get; set; } = default!;
    public string Genre { get; set; } = default!;
    public string ThumbnailUrl { get; set; } = default!;
    public int Year { get; set; }
    public string MusicBrainzId { get; set; } = default!;
    public long BitRate { get; set; }
    public long Length { get; set; }
    public string DisplayLength { get; set; } = default!;
    public NpgsqlTsVector SearchVector_EN { get; set; } = default!;

    public virtual User User { get; set; } = default!;
    public virtual Source Source { get; set; } = default!;
    public virtual Artist Artist { get; set; } = default!;
    public virtual Release Release { get; set; } = default!;
    public virtual ICollection<TrackReaction> Reactions { get; set; } = default!;
}
using TotallyWired.Domain.Contracts;

namespace TotallyWired.Domain.Entities;

public class User : IEntity
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }

    public string IdentityId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string ThumbnailUrl { get; set; } = default!;

    public virtual ICollection<Source> Sources { get; set; } = default!;
    public virtual ICollection<Artist> Artists { get; set; } = default!;
    public virtual ICollection<Release> Releases { get; set; } = default!;
    public virtual ICollection<Track> Tracks { get; set; } = default!;
    public virtual ICollection<TrackReaction> TrackReactions { get; set; } = default!;
}

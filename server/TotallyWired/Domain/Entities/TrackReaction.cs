using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;

namespace TotallyWired.Domain.Entities;

public class TrackReaction : IUserSpecific
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    public Guid UserId { get; set; }
    public Guid TrackId { get; set; }
    public ReactionType Reaction { get; set; }

    public virtual User User { get; set; } = default!;
    public virtual Track Track { get; set; } = default!;
}

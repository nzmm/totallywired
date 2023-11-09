using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;

namespace TotallyWired.Domain.Entities;

public class Source : IEntity
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }

    public Guid UserId { get; set; }

    public SourceType Type { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string AccessToken { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
    public DateTime ExpiresAt { get; set; } = default!;
    public string Delta { get; set; } = string.Empty;

    public virtual User User { get; set; } = default!;
    public virtual ICollection<Track> Tracks { get; set; } = default!;
}

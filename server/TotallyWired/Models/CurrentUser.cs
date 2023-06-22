using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;

namespace TotallyWired.Models;

public class AnonymousUser : ICurrentUser
{
    public static readonly AnonymousUser Instance = new();

    public Guid UserId => Guid.Empty;
    public string Name => "Anonymous user";
    public string Username => string.Empty;
    public bool IsAuthenticated => false;
}

public class CurrentUser : ICurrentUser
{
    public Guid UserId { get; init; }
    public string Name { get; init; } = default!;
    public string Username { get; init; } = default!;
    public bool IsAuthenticated => true;
}
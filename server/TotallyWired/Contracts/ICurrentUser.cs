namespace TotallyWired.Domain.Contracts;

public interface ICurrentUser
{
    public Guid UserId { get; }
    public string Name { get; }
    public string Username { get; }
    public bool IsAuthenticated { get; }
}
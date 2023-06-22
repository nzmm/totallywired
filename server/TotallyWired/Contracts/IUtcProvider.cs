namespace TotallyWired.Contracts;

public interface IUtcProvider
{
    DateTime UtcNow { get; }
}
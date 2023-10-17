namespace TotallyWired.Contracts;

public interface ITimeProvider
{
    DateTime UtcNow { get; }
}

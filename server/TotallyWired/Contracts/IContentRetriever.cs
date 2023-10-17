namespace TotallyWired.Contracts;

public interface IContentRetriever<T>
{
    Task<T> RetrieveAsync(Guid userId, Guid entityId, CancellationToken cancellationToken);
}

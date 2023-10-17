using TotallyWired.Domain.Entities;

namespace TotallyWired.Contracts;

public interface IContentIndexer
{
    Task<(bool, string)> IndexAsync(Source source);
}

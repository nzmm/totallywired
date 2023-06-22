using TotallyWired.Domain.Entities;

namespace TotallyWired.Contracts;

public interface ISourceIndexer
{
    Task<(bool, string)> IndexAsync(Source source);
}
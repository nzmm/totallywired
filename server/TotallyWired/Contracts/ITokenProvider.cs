using TotallyWired.Domain.Entities;

namespace TotallyWired.Contracts;

public interface ITokenProvider
{
    Task<Source> RetrieveAndStoreTokensAsync(string authorizationCode);
    Task<Source> RefreshAndStoreTokensAsync(string refreshToken);
    Task<(string, DateTime)> GetAccessTokenAsync(Guid sourceId);
}

using TotallyWired.Domain.Contracts;

namespace TotallyWired.Contracts;

public interface IOAuthUrlHelper
{
    string GetAuthorizeUri(ICurrentUser user);
    string GetTokenUri();
    string GetTokenRefreshUri();
}
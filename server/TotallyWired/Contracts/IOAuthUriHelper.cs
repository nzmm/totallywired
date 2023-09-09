namespace TotallyWired.Contracts;

public interface IOAuthUrlHelper
{
    string GetAuthorizeUri();
    string GetTokenUri();
    string GetTokenRefreshUri();
}

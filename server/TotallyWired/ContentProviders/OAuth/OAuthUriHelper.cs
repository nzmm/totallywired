using Microsoft.AspNetCore.WebUtilities;

namespace TotallyWired.ContentProviders.OAuth;

public static class OAuthUriHelper
{
    public static string GetAuthorizeUri(OAuthCommonOptions config)
    {
        var queryString = new Dictionary<string, string>
        {
            { "client_id", config.ClientId },
            { "redirect_uri", config.RedirectUri },
            { "scope", config.Scope },
            { "state", string.Empty },
            { "response_type", "code" },
            { "response_mode", "query" }
        };

        var baseUri = $"{config.Authority}/authorize";
        return QueryHelpers.AddQueryString(baseUri, queryString);
    }

    public static string GetTokenUri(OAuthCommonOptions config)
    {
        return $"{config.Authority}/token";
    }
}

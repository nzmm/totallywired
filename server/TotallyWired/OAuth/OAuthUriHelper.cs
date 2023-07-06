using Microsoft.AspNetCore.WebUtilities;
using TotallyWired.Contracts;
using TotallyWired.Indexers.MicrosoftGraph;

namespace TotallyWired.OAuth;

public class OAuthUriHelper : IOAuthUrlHelper
{
    private readonly MicrosoftGraphIndexerOptions _config;
    
    public OAuthUriHelper(MicrosoftGraphIndexerOptions config)
    {
        _config = config;
    }

    public string GetAuthorizeUri()
    {
        var @params = new Dictionary<string, string>
        {
            { "client_id", _config.ClientId },
            { "redirect_uri", _config.RedirectUri },
            { "scope", _config.Scope },
            { "state", string.Empty },
            { "response_type", "code" },
            { "response_mode", "query" }
        };

        var baseUri = $"{_config.Authority}/authorize";
        return QueryHelpers.AddQueryString(baseUri, @params);
    }

    public string GetTokenUri()
    {
        return $"{_config.Authority}/token";
    }

    public string GetTokenRefreshUri()
    {
        return $"{_config.Authority}/token";
    }
}
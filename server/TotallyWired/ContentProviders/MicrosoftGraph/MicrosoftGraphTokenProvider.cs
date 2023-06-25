using System.Net.Http.Json;
using System.Security.Authentication;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.ContentProviders.MicrosoftGraph;

public class MicrosoftGraphTokenProvider : ITokenProvider
{
    private readonly ICurrentUser _user;
    private readonly HttpClient _httpClient;
    private readonly IUtcProvider _utcProvider;
    private readonly TotallyWiredDbContext _context;
    private readonly MicrosoftGraphOAuthConfiguration _config;
    private readonly MicrosoftGraphOAuthUriHelper _uriHelper;

    public MicrosoftGraphTokenProvider(
        ICurrentUser user,
        HttpClient httpClient,
        IUtcProvider utcProvider,
        TotallyWiredDbContext dbContext,
        MicrosoftGraphOAuthConfiguration config,
        MicrosoftGraphOAuthUriHelper uriHelper)
    {
        _user = user;
        _httpClient = httpClient;
        _utcProvider = utcProvider;
        _context = dbContext;
        _config = config;
        _uriHelper = uriHelper;
    }

    private IQueryable<Source> GetSource()
    {
        return _context.Sources
            .Where(x => x.UserId == _user.UserId && x.Type == SourceType.MicrosoftGraph);
    }
    
    private async Task<Source> StoreTokensAsync(TokenResultModel tokens)
    {
        var source = await GetSource().FirstOrDefaultAsync() ?? new Source
        {
            UserId = _user.UserId,
            Type = SourceType.MicrosoftGraph
        };

        var created = source.Id == Guid.Empty;
        var expiry = _utcProvider.UtcNow.AddSeconds(tokens.ext_expires_in * .9);
        
        source.RefreshToken = tokens.refresh_token;
        source.AccessToken = tokens.access_token;
        source.ExpiresAt = expiry;

        if (created)
        {
            source.Id = Guid.NewGuid();
            await _context.AddAsync(source);
        }
        else
        {
            _context.Update(source);
        }

        await _context.SaveChangesAsync();
        return source;
    }

    public async Task<Source> RetrieveAndStoreTokensAsync(string authorizationCode)
    {
        var content = new FormUrlEncodedContent(new []
        {
            new KeyValuePair<string, string>("client_id", _config.ClientId),
            new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
            new KeyValuePair<string, string>("redirect_uri", _config.RedirectUri),
            new KeyValuePair<string, string>("scope", _config.Scope),
            new KeyValuePair<string, string>("code", authorizationCode),
            new KeyValuePair<string, string>("grant_type", "authorization_code")
        });
            
        var tokenUrl = _uriHelper.GetTokenUri();
        var response = await _httpClient.PostAsync(tokenUrl, content);
        var tokenResult = await response.Content.ReadFromJsonAsync<TokenResultModel>();

        if (tokenResult?.access_token is null || tokenResult.refresh_token is null)
        {
            throw new InvalidCredentialException("token result is invalid");
        }

        return await StoreTokensAsync(tokenResult);
    }
    
    public async Task<Source> RefreshAndStoreTokensAsync(string refreshToken)
    {
        var content = new FormUrlEncodedContent(new []
        {
            new KeyValuePair<string, string>("client_id", _config.ClientId),
            new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
            new KeyValuePair<string, string>("scope", _config.Scope),
            new KeyValuePair<string, string>("refresh_token", refreshToken),
            new KeyValuePair<string, string>("grant_type", "refresh_token")
        });
            
        var tokenUrl = _uriHelper.GetTokenUri();
        var response = await _httpClient.PostAsync(tokenUrl, content);
        var tokenResult = await response.Content.ReadFromJsonAsync<TokenResultModel>();

        if (tokenResult?.access_token is null || tokenResult.refresh_token is null)
        {
            throw new InvalidCredentialException("token result is invalid");
        }
        
        return await StoreTokensAsync(tokenResult);
    }

    public async Task<(string, DateTime)> GetAccessTokenAsync(Guid sourceId)
    {
        var cachedTokens = await GetSource()
            .Where(x => x.Id == sourceId)
            .Select(x => new { x.AccessToken, x.ExpiresAt })
            .FirstOrDefaultAsync();

        if (cachedTokens is null)
        {
            throw new ArgumentNullException(nameof(cachedTokens), "cached tokens do not., exist");
        }
        if (_utcProvider.UtcNow <= cachedTokens.ExpiresAt)
        {
            return (cachedTokens.AccessToken, cachedTokens.ExpiresAt);
        }

        var refreshToken = await GetSource()
            .Select(x => x.RefreshToken)
            .FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new ArgumentNullException(nameof(refreshToken), "refresh_token does not exist");
        }

        var source = await RefreshAndStoreTokensAsync(refreshToken);
        return (source.AccessToken, source.ExpiresAt);
    }
}
using System.Net.Http.Json;
using System.Security.Authentication;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Common;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;
using TotallyWired.OAuth;

namespace TotallyWired.Indexers.MicrosoftGraph;

public class MicrosoftGraphTokenProvider : ITokenProvider
{
    private readonly ICurrentUser _user;
    private readonly HttpClient _httpClient;
    private readonly TotallyWiredDbContext _context;
    private readonly OAuthUriHelper _uriHelper;
    private readonly MicrosoftGraphIndexerOptions _config;

    public MicrosoftGraphTokenProvider(
        ICurrentUser user,
        HttpClient httpClient,
        TotallyWiredDbContext dbContext,
        MicrosoftGraphIndexerOptions config,
        OAuthUriHelper uriHelper
    )
    {
        _user = user;
        _httpClient = httpClient;
        _context = dbContext;
        _config = config;
        _uriHelper = uriHelper;
    }

    private IQueryable<Source> GetSource()
    {
        var userId = _user.UserId();
        return _context.Sources.Where(
            x => x.UserId == userId && x.Type == SourceType.MicrosoftGraph
        );
    }

    private async Task<Source> StoreTokensAsync(TokenResultModel tokens)
    {
        var userId = _user.UserId();
        if (userId == default)
        {
            throw new ArgumentException(nameof(userId));
        }

        var source =
            await GetSource().FirstOrDefaultAsync()
            ?? new Source { UserId = userId, Type = SourceType.MicrosoftGraph };

        var created = source.Id == Guid.Empty;
        var expiry = UtcProvider.UtcNow.AddSeconds(tokens.ext_expires_in * .9);

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
        if (string.IsNullOrEmpty(authorizationCode))
        {
            throw new ArgumentException("authorizationCode result is invalid");
        }

        var content = new FormUrlEncodedContent(
            new[]
            {
                new KeyValuePair<string, string>("client_id", _config.ClientId),
                new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
                new KeyValuePair<string, string>("redirect_uri", _config.RedirectUri),
                new KeyValuePair<string, string>("scope", _config.Scope),
                new KeyValuePair<string, string>("code", authorizationCode),
                new KeyValuePair<string, string>("grant_type", "authorization_code")
            }
        );

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
        var content = new FormUrlEncodedContent(
            new[]
            {
                new KeyValuePair<string, string>("client_id", _config.ClientId),
                new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
                new KeyValuePair<string, string>("scope", _config.Scope),
                new KeyValuePair<string, string>("refresh_token", refreshToken),
                new KeyValuePair<string, string>("grant_type", "refresh_token")
            }
        );

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
        if (UtcProvider.UtcNow <= cachedTokens.ExpiresAt)
        {
            return (cachedTokens.AccessToken, cachedTokens.ExpiresAt);
        }

        var refreshToken = await GetSource().Select(x => x.RefreshToken).FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new ArgumentNullException(nameof(refreshToken), "refresh_token does not exist");
        }

        var source = await RefreshAndStoreTokensAsync(refreshToken);
        return (source.AccessToken, source.ExpiresAt);
    }
}

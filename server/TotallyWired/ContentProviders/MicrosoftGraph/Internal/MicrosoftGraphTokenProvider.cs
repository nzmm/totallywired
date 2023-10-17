using System.Net.Http.Json;
using System.Security.Authentication;
using Microsoft.EntityFrameworkCore;
using TotallyWired.ContentProviders.OAuth;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.ContentProviders.MicrosoftGraph.Internal;

public class MicrosoftGraphTokenProvider(
    ICurrentUser user,
    HttpClient httpClient,
    ITimeProvider timeProvider,
    TotallyWiredDbContext dbContext,
    MicrosoftGraphContentProviderOptions config
)
{
    private IQueryable<Source> GetSource()
    {
        var userId = user.UserId();
        return dbContext.Sources.Where(x => x.UserId == userId && x.Type == SourceType.Microsoft);
    }

    private async Task<Source> StoreTokensAsync(TokenResultModel tokens)
    {
        var userId = user.UserId();
        if (userId == default)
        {
            throw new ArgumentException(nameof(userId));
        }

        var source =
            await GetSource().FirstOrDefaultAsync()
            ?? new Source { UserId = userId, Type = SourceType.Microsoft };

        var created = source.Id == Guid.Empty;
        var expiry = timeProvider.UtcNow.AddSeconds(tokens.ext_expires_in * .9);

        source.RefreshToken = tokens.refresh_token;
        source.AccessToken = tokens.access_token;
        source.ExpiresAt = expiry;

        if (created)
        {
            source.Id = Guid.NewGuid();
            await dbContext.AddAsync(source);
        }
        else
        {
            dbContext.Update(source);
        }

        await dbContext.SaveChangesAsync();
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
                new KeyValuePair<string, string>("client_id", config.ClientId),
                new KeyValuePair<string, string>("client_secret", config.ClientSecret),
                new KeyValuePair<string, string>("redirect_uri", config.RedirectUri),
                new KeyValuePair<string, string>("scope", config.Scope),
                new KeyValuePair<string, string>("code", authorizationCode),
                new KeyValuePair<string, string>("grant_type", "authorization_code")
            }
        );

        var tokenUrl = OAuthUriHelper.GetTokenUri(config);
        var response = await httpClient.PostAsync(tokenUrl, content);
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
                new KeyValuePair<string, string>("client_id", config.ClientId),
                new KeyValuePair<string, string>("client_secret", config.ClientSecret),
                new KeyValuePair<string, string>("scope", config.Scope),
                new KeyValuePair<string, string>("refresh_token", refreshToken),
                new KeyValuePair<string, string>("grant_type", "refresh_token")
            }
        );

        var tokenUrl = OAuthUriHelper.GetTokenUri(config);
        var response = await httpClient.PostAsync(tokenUrl, content);
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
        if (timeProvider.UtcNow <= cachedTokens.ExpiresAt)
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

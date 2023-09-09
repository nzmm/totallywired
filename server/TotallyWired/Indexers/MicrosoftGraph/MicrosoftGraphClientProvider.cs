using System.Net.Http.Headers;
using Microsoft.Graph;

namespace TotallyWired.Indexers.MicrosoftGraph;

public class MicrosoftGraphClientProvider
{
    private readonly MicrosoftGraphTokenProvider _tokenProvider;

    public MicrosoftGraphClientProvider(MicrosoftGraphTokenProvider tokenProvider)
    {
        _tokenProvider = tokenProvider;
    }

    public async Task<GraphServiceClient?> GetClientAsync(Guid sourceId)
    {
        var (accessToken, _) = await _tokenProvider.GetAccessTokenAsync(sourceId);

        if (string.IsNullOrEmpty(accessToken))
        {
            return null;
        }

        return new GraphServiceClient((IAuthenticationProvider)null!)
        {
            AuthenticationProvider = new DelegateAuthenticationProvider(request =>
            {
                request.Headers.Authorization = new AuthenticationHeaderValue(
                    "Bearer",
                    accessToken
                );

                return Task.CompletedTask;
            })
        };
    }
}

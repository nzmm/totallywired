using System.Net.Http.Headers;
using Microsoft.Graph;

namespace TotallyWired.ContentProviders.MicrosoftGraph.Internal;

public class MicrosoftGraphClientProvider(MicrosoftGraphTokenProvider tokenProvider)
{
    public async Task<GraphServiceClient?> GetClientAsync(Guid sourceId)
    {
        var (accessToken, _) = await tokenProvider.GetAccessTokenAsync(sourceId);

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

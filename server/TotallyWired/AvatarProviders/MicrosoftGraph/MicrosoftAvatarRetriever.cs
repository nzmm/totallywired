using System.Net.Http.Headers;
using Microsoft.Graph;
using TotallyWired.Contracts;
using Directory = System.IO.Directory;

namespace TotallyWired.AvatarProviders.MicrosoftGraph;

public class MicrosoftAvatarRetriever(ICurrentUser user)
{
    public async Task<bool> CacheAvatarAsync(string accessToken)
    {
        if (string.IsNullOrEmpty(accessToken))
        {
            return false;
        }

        var graphClient = new GraphServiceClient((IAuthenticationProvider)null!)
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

        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatars");
        if (!Directory.Exists(basePath))
        {
            Directory.CreateDirectory(basePath);
        }

        try
        {
            var path = Path.Combine(basePath, $"{user.UserId()}.jpg");
            await using var avatar = await graphClient.Me.Photos["64x64"].Content
                .Request()
                .GetAsync();
            await using var file = new FileStream(path, FileMode.Create);
            await avatar.CopyToAsync(file);
        }
        catch
        {
            return false;
        }

        return true;
    }
}

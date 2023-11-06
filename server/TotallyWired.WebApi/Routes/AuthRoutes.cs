using Microsoft.AspNetCore.Authentication;
using TotallyWired.AvatarProviders.MicrosoftGraph;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.WebApi.Authentication;
using WebApplication = Microsoft.AspNetCore.Builder.WebApplication;

namespace TotallyWired.WebApi.Routes;

public static class AuthRoutes
{
    public static void MapAuthRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/accounts");

        group.MapGet(
            "/signout",
            async (HttpContext context) =>
            {
                await context.SignOutAsync();
                return Results.Redirect("/");
            }
        );

        group.MapGet(
            "/login/{provider}",
            (string provider) =>
                Results.Challenge(
                    properties: new AuthenticationProperties
                    {
                        RedirectUri = $"/accounts/signin/{provider}"
                    },
                    authenticationSchemes: new[] { provider }
                )
        );

        group.MapGet(
            "signin/{provider}",
            async (
                HttpContext context,
                TotallyWiredDbContext db,
                MicrosoftAvatarRetriever avatars,
                string provider
            ) =>
            {
                var (success, accessToken) = await context.AuthenticateUserAsync(db, provider);
                if (success)
                {
                    await avatars.CacheAvatarAsync(accessToken);
                    return Results.Redirect("/");
                }

                await context.SignOutAsync(provider);
                return Results.Unauthorized();
            }
        );
    }
}

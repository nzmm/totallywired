using Microsoft.AspNetCore.Authentication;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.WebApi.Authentication;
using WebApplication = Microsoft.AspNetCore.Builder.WebApplication;

namespace TotallyWired.WebApi.Routes;

public static class AuthRoutes
{
    public static void MapAuthRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/accounts");
        
        group.MapGet("/signout", context => context.SignOutAsync());
        
        group.MapGet("/login/{provider}",(string provider) => Results.Challenge(
            properties: new() { RedirectUri = $"/accounts/signin/{provider}" },
            authenticationSchemes: new[] { provider }));

        group.MapGet("signin/{provider}", async (HttpContext context, TotallyWiredDbContext db, string provider) =>
        {
            var success = await context.AuthenticateUserAsync(db, provider);
            if (success)
            {
                return Results.Redirect("/");
            }

            await context.SignOutAsync(provider);
            return Results.Unauthorized();
        });
    }
}
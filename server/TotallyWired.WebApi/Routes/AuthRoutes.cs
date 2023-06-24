using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using WebApplication = Microsoft.AspNetCore.Builder.WebApplication;

namespace TotallyWired.WebApi.Routes;

public static class AuthRoutes
{
    public static void MapAuthRoutes(this WebApplication app)
    {
        app.MapGet("/accounts/sign-out", context => context.SignOutAsync());
        app.MapGet("/accounts/sign-in",() => Results.Redirect("/lib/tracks")).RequireAuthorization();

        app.MapGet("/antiforgery/token", (IAntiforgery antiforgeryService, HttpContext context) =>
        {
            var tokens = antiforgeryService.GetAndStoreTokens(context);

            context.Response.Cookies.Append(
                "XSRF-TOKEN", tokens.RequestToken!, new CookieOptions { HttpOnly = false });

            return Results.Ok();
        }).RequireAuthorization();
    }
}
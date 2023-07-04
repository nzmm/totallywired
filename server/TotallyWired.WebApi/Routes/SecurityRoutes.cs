using Microsoft.AspNetCore.Antiforgery;

namespace TotallyWired.WebApi.Routes;

public static class SecurityRoutes
{
    public static void MapSecurityRoutes(this WebApplication app)
    {
        app.MapGet("/antiforgery/token", (IAntiforgery antiforgeryService, HttpContext context) =>
        {
            var tokens = antiforgeryService.GetAndStoreTokens(context);

            context.Response.Cookies.Append(
                "XSRF-TOKEN", tokens.RequestToken!, new CookieOptions { HttpOnly = false });

            return Results.Ok();
        }).RequireAuthorization();
    }
}
using System.Security.Claims;

namespace TotallyWired.WebApi.Routes;

public static class UserRoutes
{
    public static void MapUserRoutes(this WebApplication app)
    {
        // IMPORTANT: This endpoint should not require authentication
        app.MapGet(
                "/api/v1/whoami",
                (ClaimsPrincipal user) =>
                {
                    var userId = user.FindFirstValue("tw_userid") ?? string.Empty;
                    var username = user.FindFirstValue("tw_username") ?? string.Empty;
                    var name = user.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
                    return Results.Ok(
                        new
                        {
                            userId,
                            username,
                            name
                        }
                    );
                }
            )
            .RequireAuthorization();
    }
}

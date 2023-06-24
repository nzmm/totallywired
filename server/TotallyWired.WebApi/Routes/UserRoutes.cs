using TotallyWired.Domain.Contracts;

namespace TotallyWired.WebApi.Routes;

public static class UserRoutes
{
    public static void MapUserRoutes(this WebApplication app)
    {
        // IMPORTANT: This endpoint should not require authentication
        app.MapGet("/api/v1/whoami",
            (ICurrentUser user) => Results.Ok(new { user.UserId, user.Name, user.Username, user.IsAuthenticated }));
    }
}
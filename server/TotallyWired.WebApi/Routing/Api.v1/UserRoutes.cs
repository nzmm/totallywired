using TotallyWired.Domain.Contracts;

namespace TotallyWired.WebApi.Routing.Api.v1;

public static class UserRoutes
{
    public static void MapUserRoutes(this WebApplication app)
    {
        var group = app
            .MapGroup("/api/v1/me");

        // IMPORTANT: This endpoint should not require authentication
        group.MapGet("",
            (ICurrentUser user) => Results.Ok(new { user.UserId, user.Name, user.Username, user.IsAuthenticated }));
    }
}
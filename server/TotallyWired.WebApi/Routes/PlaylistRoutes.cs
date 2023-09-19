using TotallyWired.Handlers.PlaylistQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class PlaylistRoutes
{
    public static void MapPlaylistRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/playlists").RequireAuthorization().ValidateAntiforgery();

        group.MapGet(
            "",
            async (PlaylistListQueryHandler handler, CancellationToken cancellationToken) =>
            {
                var playlists = await handler.HandleAsync(cancellationToken);
                return Results.Ok(playlists);
            }
        );
    }
}

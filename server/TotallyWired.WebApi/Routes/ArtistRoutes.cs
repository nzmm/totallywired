using TotallyWired.Contracts;
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Models;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ArtistRoutes
{
    public static void MapArtistRoutes(this WebApplication app)
    {
        /*
        var group = app
            .MapGroup("/api/v1/artists")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        group.MapGet("", async (ArtistListHandler handler, string? q, CancellationToken cancellationToken) =>
        {
            var artists = await handler.HandleAsync(new ArtistListQuery { Terms = q }, cancellationToken);
            return Results.Ok(artists);
        });
        */
    }
}
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ArtistRoutes
{
    public static void MapArtistRoutes(this WebApplication app)
    {
        var group = app
            .MapGroup("/api/v1/artists")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        group.MapGet("", async (ArtistListHandler handler, [AsParameters] ArtistListSearchParams @params, CancellationToken cancellationToken) =>
        {
            var artists = await handler.HandleAsync(@params, cancellationToken);
            return Results.Ok(artists);
        });
        
        group.MapGet("/{artistId:guid}/tracks", async (TrackListHandler handler, [AsParameters] TrackListSearchParams @params, CancellationToken cancellationToken) =>
        {
            var tracks = await handler.HandleAsync(@params, cancellationToken);
            return Results.Ok(tracks);
        });
    }
}
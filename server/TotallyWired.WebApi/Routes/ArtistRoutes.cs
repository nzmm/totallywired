using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ArtistRoutes
{
    public static void MapArtistRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/artists").RequireAuthorization().ValidateAntiforgery();

        group.MapGet(
            "",
            async (
                ArtistListQueryHandler handler,
                [AsParameters] ArtistListSearchParams @params,
                CancellationToken cancellationToken
            ) =>
            {
                var artists = await handler.HandleAsync(@params, cancellationToken);
                return Results.Ok(artists);
            }
        );

        group.MapGet(
            "/{artistId:guid}",
            async (
                ArtistQueryHandler handler,
                Guid artistId,
                CancellationToken cancellationToken
            ) =>
            {
                var artist = await handler.HandleAsync(artistId, cancellationToken);
                return artist is null ? Results.BadRequest() : Results.Ok(artist);
            }
        );

        group.MapGet(
            "/{artistId:guid}/tracks",
            async (
                TrackListQueryHandler handler,
                [AsParameters] TrackListSearchParams @params,
                CancellationToken cancellationToken
            ) =>
            {
                var tracks = await handler.HandleAsync(@params, cancellationToken);
                return Results.Ok(tracks);
            }
        );

        group.MapGet(
            "/{artistId:guid}/art",
            async (
                ArtistThumbnailQueryHandler handler,
                Guid artistId,
                CancellationToken cancellationToken
            ) =>
            {
                var thumbnailUrl = await handler.HandleAsync(artistId, cancellationToken);
                return Results.Redirect(thumbnailUrl);
            }
        );
    }
}

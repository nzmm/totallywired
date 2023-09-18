using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.TrackCommands;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.Models;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class TrackRoutes
{
    public static void MapTrackRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/tracks").RequireAuthorization().ValidateAntiforgery();

        group.MapGet(
            "",
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
            "/{trackId:guid}/downloadUrl",
            async (
                TrackDownloadUrlQueryHandler handler,
                Guid trackId,
                CancellationToken cancellationToken
            ) =>
            {
                var downloadUrl = await handler.HandleAsync(trackId, cancellationToken);
                return Results.Ok(downloadUrl);
            }
        );

        /*
        group.MapGet("/{trackId:guid}/fileInfo", async (ReleaseFilenameHandler handler, Guid trackId, CancellationToken cancellationToken) =>
        {
            var fileInfo = await handler.HandleAsync(new TrackFileInfoQuery
            {
                TrackId = trackId
            }, cancellationToken);

            return Results.Ok(fileInfo);
        });
        */

        group.MapPost(
            "/{trackId:guid}/react",
            async (
                TrackReactionCommandHandler handler,
                Guid trackId,
                [FromBody] TrackLikedModel dto,
                CancellationToken cancellationToken
            ) =>
            {
                var reaction = await handler.HandleAsync(
                    new TrackReactionCommand { TrackId = trackId, Reaction = dto.Reaction },
                    cancellationToken
                );
                return Results.Ok(reaction);
            }
        );
    }
}

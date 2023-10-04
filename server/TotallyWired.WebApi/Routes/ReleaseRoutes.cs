using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.ReleaseCommands;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ReleaseRoutes
{
    public static void MapReleaseRoutes(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/releases").RequireAuthorization().ValidateAntiforgery();

        group.MapGet(
            "",
            async (
                ReleaseListQueryHandler handler,
                [AsParameters] ReleaseListSearchParams @params,
                CancellationToken cancellationToken
            ) =>
            {
                var releases = await handler.HandleAsync(@params, cancellationToken);
                return Results.Ok(releases);
            }
        );

        group.MapGet(
            "/as-collection",
            async (
                ReleaseCollectionsQueryHandler handler,
                [AsParameters] ReleaseCollectionsSearchParams @params,
                CancellationToken cancellationToken
            ) =>
            {
                var releases = await handler.HandleAsync(@params, cancellationToken);
                return Results.Ok(releases);
            }
        );

        group.MapGet(
            "/{releaseId:guid}",
            async (
                ReleaseQueryHandler handler,
                Guid releaseId,
                CancellationToken cancellationToken
            ) =>
            {
                var release = await handler.HandleAsync(releaseId, cancellationToken);
                return release is null ? Results.BadRequest() : Results.Ok(release);
            }
        );

        group.MapGet(
            "/{releaseId:guid}/tracks",
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

        group.MapPost(
            "/{releaseId:guid}",
            async (
                UpdateReleaseMetadataCommandHandler handler,
                Guid releaseId,
                [FromBody] ReleaseMetadataCommand command,
                CancellationToken cancellationToken
            ) =>
            {
                command.ReleaseId = releaseId;
                var result = await handler.HandleAsync(command, cancellationToken);
                return result.Success
                    ? Results.Ok(new { ReleaseId = result.Release!.Id })
                    : Results.BadRequest();
            }
        );

        group.MapGet(
            "/{releaseId:guid}/art",
            async (
                ReleaseThumbnailQueryHandler handler,
                Guid releaseId,
                CancellationToken cancellationToken
            ) =>
            {
                var thumbnailUrl = await handler.HandleAsync(releaseId, cancellationToken);

                return Results.Redirect(thumbnailUrl);
            }
        );
    }
}

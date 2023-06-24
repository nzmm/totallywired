using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.ReleaseCommands;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Models;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ReleaseRoutes
{
    public static void MapReleaseRoutes(this WebApplication app)
    {
        /*
        var group = app
            .MapGroup("/api/v1/releases")
            .RequireAuthorization()
            .ValidateAntiforgery();

        group.MapGet("", async (ReleaseListHandler handler, string? q, bool? includeTracks, CancellationToken cancellationToken) =>
        {
            var releases = await handler.HandleAsync(new ReleaseListQuery
            {
                Terms = q,
                IncludeTracks = includeTracks ?? true
            }, cancellationToken);
            
            return Results.Ok(releases);
        });
        
        group.MapPost("/{releaseId:guid}", async (ReleaseMetadataUpdateHandler handler, Guid releaseId, [FromBody] ReleaseMetadataModel metadata, CancellationToken cancellationToken) =>
        {
            if (releaseId != metadata.ReleaseId)
            {
                return Results.BadRequest();
            }

            var result = await handler.HandleAsync(new ReleaseMetadataUpdateCommand
            {
                ReleaseId = releaseId,
                Metadata = metadata
            }, cancellationToken);
            
            return result.Success ? Results.Ok(result.Release!.Id) : Results.BadRequest();
        });
        
        group.MapGet("/{releaseId:guid}/thumbnailUrl", async (ReleaseThumbnailHandler handler, Guid releaseId, CancellationToken cancellationToken) =>
        {
            var thumbnailUrl = await handler.HandleAsync(new ReleaseThumbnailQuery
            {
                ReleaseId = releaseId
            }, cancellationToken);

            return Results.Redirect(thumbnailUrl);
        });
        */
    }
}
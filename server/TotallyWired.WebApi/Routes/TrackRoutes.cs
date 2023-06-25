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
        var group = app
            .MapGroup("/api/v1/tracks")
            .RequireAuthorization()
            .ValidateAntiforgery();

        group.MapGet("", async (TrackListHandler handler, CancellationToken cancellationToken) =>
        {
            var tracks = await handler.HandleAsync(new TrackListQuery(), cancellationToken);

            return Results.Ok(tracks);
        });

        group.MapGet("/{trackId:guid}/downloadUrl", async (TrackDownloadUrlHandler handler, Guid trackId, CancellationToken cancellationToken) =>
        {
            var downloadUrl = await handler.HandleAsync(trackId, cancellationToken);

            return Results.Ok(downloadUrl);
        });
        
        /*
        group.MapGet("/search/all", async (TrackAllSearchHandler handler, string? q, CancellationToken cancellationToken) =>
        {
            var matches = await handler.HandleAsync(new TrackAllSearchQuery
            {
                Terms = q ?? string.Empty
            }, cancellationToken);
            
            return Results.Ok(matches);
        });

        group.MapGet("/{trackId:guid}/fileInfo", async (ReleaseFilenameHandler handler, Guid trackId, CancellationToken cancellationToken) =>
        {
            var fileInfo = await handler.HandleAsync(new TrackFileInfoQuery
            {
                TrackId = trackId
            }, cancellationToken);

            return Results.Ok(fileInfo);
        });
        
        group.MapPost("/{trackId:guid}/like", async (TrackReactionHandler handler, Guid trackId, [FromBody] TrackLikedModel dto, CancellationToken cancellationToken) =>
        {
            var (_, reaction) = await handler.HandleAsync(new TrackReactionCommand
            {
                TrackId = trackId,
                Reaction = dto.ReactionType
            }, cancellationToken);

            return Results.Ok(reaction);
        });
        */
    }
}
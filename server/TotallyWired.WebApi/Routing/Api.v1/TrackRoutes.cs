using MediatR;
using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.TrackCommands;
using TotallyWired.Handlers.TrackQueries;
using TotallyWired.Models;
using TotallyWired.WebApi.Extensions;

namespace TotallyWired.WebApi.Routing.Api.v1;

public static class TrackRoutes
{
    public static void MapTrackRoutes(this WebApplication app)
    {
        var group = app
            .MapGroup("/api/v1/tracks")
            .RequireAuthorization()
            .ValidateAntiforgery();

        group.MapGet("", async (IMediator mediator, string? q, bool liked) =>
        {
            var tracks = await mediator.Send(new TrackListQuery
            {
                Terms = q,
                RestrictToLiked = liked
            });
            return Results.Ok(tracks);
        });

        group.MapGet("/search/all", async (IMediator mediator, string? q) =>
        {
            var matches = await mediator.Send(new TrackAllSearchQuery
            {
                Terms = q ?? string.Empty
            });
            return Results.Ok(matches);
        });
        
        group.MapGet("/{trackId:guid}/downloadUrl", async (IMediator mediator, Guid trackId) =>
        {
            var downloadUrl = await mediator.Send(new TrackDownloadUrlQuery
            {
                TrackId = trackId
            });
            return Results.Ok(downloadUrl);
        });

        group.MapGet("/{trackId:guid}/fileInfo", async (IMediator mediator, Guid trackId) =>
        {
            var fileInfo = await mediator.Send(new TrackFileInfoQuery
            {
                TrackId = trackId
            });
            return Results.Ok(fileInfo);
        });
        
        group.MapPost("/{trackId:guid}/like", async (IMediator mediator, Guid trackId, [FromBody] TrackLikedModel dto ) =>
        {
            var (_, reaction) = await mediator.Send(new TrackReactionCommand
            {
                TrackId = trackId,
                Reaction = dto.ReactionType
            });
            return Results.Ok(reaction);
        });
    }
}
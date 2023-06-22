using MediatR;
using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.ReleaseCommands;
using TotallyWired.Handlers.ReleaseQueries;
using TotallyWired.Models;
using TotallyWired.WebApi.Extensions;

namespace TotallyWired.WebApi.Routing.Api.v1;

public static class ReleaseRoutes
{
    public static void MapReleaseRoutes(this WebApplication app)
    {
        var group = app
            .MapGroup("/api/v1/releases")
            .RequireAuthorization()
            .ValidateAntiforgery();

        group.MapGet("", async (IMediator mediator, string? q, bool? includeTracks) =>
        {
            var releases = await mediator.Send(new ReleaseListQuery
            {
                Terms = q,
                IncludeTracks = includeTracks ?? true
            });
            return Results.Ok(releases);
        });
        
        group.MapPost("/{releaseId:guid}", async (IMediator mediator, Guid releaseId, [FromBody] ReleaseMetadataModel metadata) =>
        {
            if (releaseId != metadata.ReleaseId)
            {
                return Results.BadRequest();
            }

            var result = await mediator.Send(new ReleaseMetadataUpdateCommand
            {
                ReleaseId = releaseId,
                Metadata = metadata
            });
            
            return result.Success ? Results.Ok(result.Release!.Id) : Results.BadRequest();
        });
        
        group.MapGet("/{releaseId:guid}/thumbnailUrl", async (IMediator mediator, Guid releaseId) =>
        {
            var thumbnailUrl = await mediator.Send(new ReleaseThumbnailQuery
            {
                ReleaseId = releaseId
            });
            return Results.Redirect(thumbnailUrl);
        });
    }
}
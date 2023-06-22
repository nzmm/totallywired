using MediatR;
using TotallyWired.Handlers.ArtistQueries;
using TotallyWired.WebApi.Extensions;

namespace TotallyWired.WebApi.Routing.Api.v1;

public static class ArtistRoutes
{
    public static void MapArtistRoutes(this WebApplication app)
    {
        var group = app
            .MapGroup("/api/v1/artists")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        group.MapGet("", async (IMediator mediator, string? q) =>
        {
            var artists = await mediator.Send(new ArtistListQuery
            {
                Terms = q,
            });
            return Results.Ok(artists);
        });
    }
}
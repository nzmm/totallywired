using MediatR;
using TotallyWired.Domain.Contracts;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.Vendors.MicrosoftGraph;
using TotallyWired.WebApi.Extensions;

namespace TotallyWired.WebApi.Routing.Api.v1;

public static class SourceRoutes
{
    public static void MapSourceRoutes(this WebApplication app)
    {
        var oauth = app
            .MapGroup("/sources")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        oauth.MapGet("/begin-auth-msgraph", (ICurrentUser user, MicrosoftGraphOAuthUriHelper helper) =>
        {
            var authorizeUri = helper.GetAuthorizeUri(user);
            return Results.Redirect(authorizeUri);
        });

        oauth.MapGet("/auth-msgraph", async (HttpContext context, MicrosoftGraphTokenProvider tokenProvider) =>
        {
            if (!context.Request.Query.TryGetValue("code", out var code))
            {
                return Results.Problem("No code was found");
            }
            
            await tokenProvider.RetrieveAndStoreTokensAsync(code!);
            return Results.Redirect("/");
        });
        
        var group = app
            .MapGroup("/api/v1/sources")
            .RequireAuthorization();
        
        group.MapGet("", async (IMediator mediator) =>
        {
            var sources = await mediator.Send(new SourceListQuery());
            return Results.Ok(sources.WithMetadata());
        });

        group.MapPost("/{sourceId:guid}/sync", async (IMediator mediator, Guid sourceId) =>
        {
            var (success, message) = await mediator.Send(new SourceSyncCommand
            {
                SourceId = sourceId
            });
            return Results.Ok(new { success, message });
        });
    }
}
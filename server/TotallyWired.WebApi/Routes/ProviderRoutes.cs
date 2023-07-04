using Microsoft.AspNetCore.Mvc;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ProviderRoutes
{
    public static void MapProviderRoutes(this WebApplication app)
    {
        var oauth = app
            .MapGroup("/providers")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        oauth.MapGet("/begin-auth/msgraph", (MicrosoftGraphOAuthUriHelper helper) =>
        {
            var authorizeUri = helper.GetAuthorizeUri();
            return Results.Redirect(authorizeUri);
        });

        oauth.MapGet("/auth-msgraph", async (MicrosoftGraphTokenProvider tokenProvider, [FromQuery] string code) =>
        {
            if (string.IsNullOrEmpty(code))
            {
                return Results.Problem("No code was found");
            }
            
            await tokenProvider.RetrieveAndStoreTokensAsync(code);
            return Results.Ok();
        });

        var group = app
            .MapGroup("/api/v1/providers")
            .RequireAuthorization()
            .ValidateAntiforgery();
        
        group.MapGet("", async (SourceListHandler handler, CancellationToken cancellationToken) =>
        {
            var sources = await handler.HandleAsync(cancellationToken);
            return Results.Ok(sources);
        });

        group.MapPost("/{sourceId:guid}/sync", async (SourceSyncHandler handler, Guid sourceId, CancellationToken cancellationToken) =>
        {
            var (success, message) = await handler.HandleAsync(sourceId, cancellationToken);
            return Results.Ok(new { success, message });
        });
    }
}
using TotallyWired.ContentProviders.MicrosoftGraph;
using TotallyWired.Domain.Contracts;
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
            .MapGroup("/api/v1/providers")
            .RequireAuthorization();
        
        group.MapGet("", async (SourceListHandler handler, CancellationToken cancellationToken) =>
        {
            var sources = await handler.HandleAsync(new SourceListQuery(), cancellationToken);

            return Results.Ok(sources);
        });

        group.MapPost("/{sourceId:guid}/sync", async (SourceSyncHandler handler, Guid sourceId, CancellationToken cancellationToken) =>
        {
            var (success, message) = await handler.HandleAsync(sourceId, cancellationToken);

            return Results.Ok(new { success, message });
        });
    }
}
using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.ContentProviderCommands;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class ProviderRoutes
{
    public static void MapProviderRoutes(this WebApplication app)
    {
        var oauth = app.MapGroup("/providers").RequireAuthorization().ValidateAntiforgery();

        oauth.MapGet(
            "/auth-request/{providerName}",
            async (ContentProviderAuthRequestHandler handler, string providerName) =>
            {
                var authorizeUri = await handler.HandleAsync(providerName, CancellationToken.None);
                return Results.Redirect(authorizeUri);
            }
        );

        oauth.MapGet(
            "/auth-confirm/{providerName}",
            async (
                ContentProviderAuthConfirmHandler handler,
                string providerName,
                [FromQuery] string code,
                CancellationToken cancellationToken
            ) =>
            {
                if (string.IsNullOrEmpty(code))
                {
                    return Results.Problem("Auth code missing");
                }

                var success = await handler.HandleAsync(
                    new ContentProviderAuthConfirmCommand
                    {
                        ProviderName = providerName,
                        Code = code
                    },
                    cancellationToken
                );

                return success
                    ? Results.Redirect("/lib/providers")
                    : Results.Problem("Authorization failed");
            }
        );

        var group = app.MapGroup("/api/v1/providers").RequireAuthorization().ValidateAntiforgery();

        group.MapGet(
            "",
            async (SourceListQueryHandler handler, CancellationToken cancellationToken) =>
            {
                var sources = await handler.HandleAsync(cancellationToken);
                return Results.Ok(sources);
            }
        );

        group.MapPost(
            "/{sourceId:guid}/sync",
            async (
                SourceSyncCommandHandler handler,
                Guid sourceId,
                CancellationToken cancellationToken
            ) =>
            {
                var (success, message) = await handler.HandleAsync(sourceId, cancellationToken);
                return Results.Ok(new { success, message });
            }
        );
    }
}

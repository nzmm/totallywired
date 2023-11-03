using Microsoft.AspNetCore.Mvc;
using TotallyWired.Handlers.ContentProviderCommands;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Handlers.SourceQueries;
using TotallyWired.WebApi.Security;

namespace TotallyWired.WebApi.Routes;

public static class SourceRoutes
{
    public static void MapSourceRoutes(this WebApplication app)
    {
        var providers = app.MapGroup("/providers").RequireAuthorization().ValidateAntiforgery();

        providers.MapGet(
            "/auth-request/{providerName}",
            ([FromServices] ContentProviderAuthRequestHandler handler, string providerName) =>
            {
                var authorizeUri = handler.Handle(providerName);
                return string.IsNullOrEmpty(authorizeUri)
                    ? Results.BadRequest()
                    : Results.Redirect(authorizeUri);
            }
        );

        providers.MapGet(
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
                    ? Results.Redirect("/manage/providers")
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

        group.MapGet(
            "/{sourceId:guid}",
            async (
                Guid sourceId,
                SourceQueryHandler handler,
                CancellationToken cancellationToken
            ) =>
            {
                var source = await handler.HandleAsync(sourceId, cancellationToken);
                return source is null ? Results.NotFound() : Results.Ok(source);
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

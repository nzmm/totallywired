using Microsoft.AspNetCore.Antiforgery;

namespace TotallyWired.WebApi.Security;

internal static class AntiForgeryExtensions
{
    private static readonly string[] SafeHttpMethods =
    {
        HttpMethod.Get.Method,
        HttpMethod.Head.Method,
        HttpMethod.Options.Method
    };

    public static TBuilder ValidateAntiforgery<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder
    {
        return builder.AddEndpointFilter(
            routeHandlerFilter: async (context, next) =>
            {
                if (SafeHttpMethods.Contains(context.HttpContext.Request.Method))
                {
                    return await next(context);
                }

                try
                {
                    var antiForgeryService =
                        context.HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
                    await antiForgeryService.ValidateRequestAsync(context.HttpContext);
                }
                catch (AntiforgeryValidationException)
                {
                    return Results.BadRequest("Anti-forgery token validation failed.");
                }

                return await next(context);
            }
        );
    }
}

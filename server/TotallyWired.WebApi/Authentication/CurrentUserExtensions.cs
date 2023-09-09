using TotallyWired.Contracts;

namespace TotallyWired.WebApi.Authentication;

public static class CurrentUserExtensions
{
    static ICurrentUser SetCurrentUser(IServiceProvider services)
    {
        var service = services.GetRequiredService<CurrentUserService>();
        return service.CurrentUser;
    }

    public static void AddCurrentUser(this IServiceCollection services)
    {
        services.AddScoped<CurrentUserService>();
        services.AddScoped(SetCurrentUser);
    }

    public static IApplicationBuilder UseCurrentUser(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CurrentUserMiddleware>();
    }
}

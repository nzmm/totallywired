using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using TotallyWired.Contracts;
using TotallyWired.Vendors.MicrosoftGraph;
using TotallyWired.WebApi.Middleware;

namespace TotallyWired.WebApi.Auth;

public static class ConfigureServices
{
    public static void AddTotallyWiredAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var msOidcConfig = new MicrosoftIdentityProviderConfiguration();
        var msOauthConfig = new MicrosoftGraphOAuthConfiguration();

        config.GetSection("IdentityProviders:Microsoft").Bind(msOidcConfig);
        config.GetSection("ContentProviders:Microsoft").Bind(msOauthConfig);

        services.AddSingleton(msOidcConfig);
        services.AddSingleton(msOauthConfig);

        services.AddAuthentication(opts =>
            {
                opts.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, opts =>
            {
                opts.Events.OnSigningOut = context =>
                {
                    context.Response.Redirect("/");
                    return Task.CompletedTask;
                };
            })
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, OpenIdConnect.ConfigureOpenIdConnect(msOidcConfig));

        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped(svc => svc.GetRequiredService<ICurrentUserService>().CurrentUser);
    }

    public static void UseTotallyWiredAuthentication(this WebApplication app)
    {
        app.UseMiddleware<CurrentUserMiddleware>();
    }
}
using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using TotallyWired.Infrastructure.EntityFramework;
using Directory = System.IO.Directory;
using User = TotallyWired.Domain.Entities.User;

namespace TotallyWired.WebApi.Authentication;

// https://github.com/davidfowl/TodoApi/tree/main/Todo.Web/Server
public static class AuthenticationExtensions
{
    private delegate void ExternalAuthProvider(AuthenticationBuilder authenticationBuilder, Action<object> configure);

    public static void AddAuthentication(this WebApplicationBuilder builder)
    {
        var authenticationBuilder = builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);
        
        authenticationBuilder.AddCookie();
        authenticationBuilder.AddCookie(AuthenticatonSchemes.ExternalScheme);

        // These are the list of external providers available to the application.
        // Many more are available from https://github.com/aspnet-contrib/AspNet.Security.OAuth.Providers
        var externalProviders = new Dictionary<string, ExternalAuthProvider>
        {
            ["Google"] = static (builder, configure) => builder.AddGoogle(configure),
            ["Microsoft"] = static (builder, configure) => builder.AddMicrosoftAccount(configure),
        };

        foreach (var (providerName, provider) in externalProviders)
        {
            var section = builder.Configuration.GetSection($"AuthenticationProviders:{providerName}");
            if (!section.Exists())
            {
                continue;
            }
            
            provider(authenticationBuilder, options =>
            {
                section.Bind(options);
                
                if (options is RemoteAuthenticationOptions remoteAuthenticationOptions)
                {
                    remoteAuthenticationOptions.SaveTokens = true;
                    remoteAuthenticationOptions.SignInScheme = AuthenticatonSchemes.ExternalScheme;
                }
            });
        }

        // Add the service that resolves external providers so we can show them in the UI
        builder.Services.AddSingleton<AuthenticationProviders>();
    }

    public static async Task<bool> AuthenticateUserAsync(this HttpContext context, TotallyWiredDbContext db, string provider)
    {
       // Grab the login information from the external login dance
        var result = await context.AuthenticateAsync(AuthenticatonSchemes.ExternalScheme);
        if (!result.Succeeded)
        {
            return false;
        }
        
        var principal = result.Principal;
        var id = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var name = principal.FindFirstValue(ClaimTypes.Name);
        var username = principal.FindFirstValue(ClaimTypes.Email);
        var email = principal.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email))
        {
            return false;
        }

        var user = await db.Users.FirstOrDefaultAsync(x => x.UserName == username);
        if (user is null)
        {
            user = new User
            {
                IdentityId = id,
                UserName = username,
                Name = name,
                Email = email,
                ThumbnailUrl = string.Empty
            };

            await db.Users.AddAsync(user);
        }
        else
        {
            user.IdentityId = id;
            user.Name = name;
        }

        await db.SaveChangesAsync();

        var token = result.Properties.GetString(".Token.access_token");
        if (!string.IsNullOrEmpty(token))
        {
            var graphClient = new GraphServiceClient((IAuthenticationProvider)null!)
            {
                AuthenticationProvider = new DelegateAuthenticationProvider(request =>
                {
                    request.Headers.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

                    return Task.CompletedTask;
                })
            };

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatars");
            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            var path = Path.Combine(basePath, $"{user.Id}.jpg");
            await using var avatar = await graphClient.Me.Photos["64x64"].Content.Request().GetAsync();
            await using var file = new FileStream(path, FileMode.Create);
            await avatar.CopyToAsync(file);
        }

        // Write the login cookie
        await SignIn(id, user.Id, name, email, provider).ExecuteAsync(context);
        
        return true;
    }

    private static IResult SignIn(string id, Guid userId, string name, string username, string providerName)
    {
        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, id));
        identity.AddClaim(new Claim(ClaimTypes.Name, name));
        identity.AddClaim(new Claim("tw_userid", userId.ToString()));
        identity.AddClaim(new Claim("tw_username", username));
        
        var properties = new AuthenticationProperties();
        properties.SetExternalProvider(providerName);
        
        return Results.SignIn(new ClaimsPrincipal(identity),
            properties: properties,
            authenticationScheme: CookieAuthenticationDefaults.AuthenticationScheme);
    }
    
    private const string ExternalProviderKey = "ExternalProviderName";

    public static string? GetExternalProvider(this AuthenticationProperties properties) =>
        properties.GetString(ExternalProviderKey);

    private static void SetExternalProvider(this AuthenticationProperties properties, string providerName) =>
        properties.SetString(ExternalProviderKey, providerName);
}
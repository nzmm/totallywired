using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using TotallyWired.Infrastructure.EntityFramework;
using Directory = System.IO.Directory;
using User = TotallyWired.Domain.Entities.User;

namespace TotallyWired.WebApi.Auth;

internal static class OpenIdConnect
{
    private static string ValidateIssuer(string issuer, SecurityToken token, TokenValidationParameters parameters)
    {
        if (token is not JwtSecurityToken jwtToken)
        {
            throw new SecurityTokenInvalidIssuerException($"Invalid issuer {issuer}")
            {
                InvalidIssuer = issuer
            };
        }

        foreach (var iss in parameters.ValidIssuers)
        {
            if (iss is null)
            {
                continue;
            }

            var tenantId = jwtToken.Claims.FirstOrDefault(x => x.Type == "tid");
            if (tenantId is null)
            {
                continue;
            }

            var resolvedIssuer = iss.Replace("{tenantid}", tenantId.Value);
            if (resolvedIssuer == issuer)
            {
                return issuer;
            }
        }

        throw new SecurityTokenInvalidIssuerException($"Invalid issuer {issuer}")
        {
            InvalidIssuer = issuer
        };
    }

    private static async Task OnTokenValidated(TokenValidatedContext ctx)
    {
        var token = ctx.SecurityToken;
        var identityId = token.Subject.Trim();
        var name = token.Claims.FirstOrDefault(x => x.Type == "name")?.Value.Trim() ?? string.Empty;
        var username = token.Claims.FirstOrDefault(x => x.Type == "preferred_username")?.Value.Trim() ??
                       string.Empty;
        var email = token.Claims.FirstOrDefault(x => x.Type == "email")?.Value.Trim() ?? string.Empty;

        if (string.IsNullOrEmpty(username))
        {
            return;
        }

        var db = ctx.HttpContext.RequestServices.GetRequiredService<TotallyWiredDbContext>();
        var user = await db.Users.FirstOrDefaultAsync(x => x.UserName == username);

        if (user is null)
        {
            user = new User
            {
                IdentityId = identityId,
                UserName = username,
                Name = name,
                Email = email,
                ThumbnailUrl = string.Empty
            };

            await db.Users.AddAsync(user);
        }
        else
        {
            user.IdentityId = identityId;
            user.Name = name;
        }

        await db.SaveChangesAsync();

        var accessToken = ctx.ProtocolMessage.AccessToken;
        if (string.IsNullOrEmpty(accessToken))
        {
            return;
        }

        var graphClient = new GraphServiceClient((IAuthenticationProvider)null!)
        {
            AuthenticationProvider = new DelegateAuthenticationProvider(request =>
            {
                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", accessToken);

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

    internal static Action<OpenIdConnectOptions> ConfigureOpenIdConnect(MicrosoftIdentityProviderConfiguration msOidcConfig)
    {
        return opts =>
        {
            opts.Authority = msOidcConfig.Authority;
            opts.ClientId = msOidcConfig.ClientId;
            opts.ResponseType = OpenIdConnectResponseType.IdTokenToken;
            opts.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            opts.CallbackPath = msOidcConfig.CallbackPath;
            opts.SaveTokens = true;

            opts.Scope.Clear();
            opts.Scope.Add("openid");
            opts.Scope.Add("email");
            opts.Scope.Add("profile");
            opts.Scope.Add("offline_access");
            opts.Scope.Add("user.read");

            opts.Events.OnTokenValidated = OnTokenValidated;
            opts.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerValidator = ValidateIssuer
            };
        };
    }
}
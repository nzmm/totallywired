using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.WebApi.Middleware;

public class CurrentUserMiddleware : IMiddleware
{
    private readonly ICurrentUserService _currentUserService;
    private readonly TotallyWiredDbContext _context;

    public CurrentUserMiddleware(ICurrentUserService currentUserService, TotallyWiredDbContext context)
    {
        _currentUserService = currentUserService;
        _context = context;
    }

    private static string GetClaimValue(ClaimsPrincipal principal, string claim)
    {
        return principal.Claims.FirstOrDefault(x => x.Type == claim)?.Value ?? $"{claim} not set";
    }
    
    private async Task<ICurrentUser> GetCurrentUserAsync(HttpContext context)
    {
        var userPrincipal = context.User;
        if (userPrincipal.Identity is not { IsAuthenticated: true })
        {
            return AnonymousUser.Instance;   
        }

        var username =
            userPrincipal.Claims.FirstOrDefault(x => x.Type == "preferred_username")?.Value ?? string.Empty;

        if (string.IsNullOrEmpty(username))
        {
            return AnonymousUser.Instance;
        }

        var userId = await _context.Users
            .Where(x => x.UserName == username)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();
        
        if (userId == Guid.Empty)
        {
            return AnonymousUser.Instance;
        }
        
        return new CurrentUser
        {
            UserId = userId,
            Name = GetClaimValue(userPrincipal, "name"),
            Username = GetClaimValue(userPrincipal, "preferred_username")
        };
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var currentUser = await GetCurrentUserAsync(context);           
        _currentUserService.SetCurrentUser(currentUser);
        await next.Invoke(context);
    }
}
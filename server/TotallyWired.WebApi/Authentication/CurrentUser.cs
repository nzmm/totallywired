using System.Security.Claims;
using TotallyWired.Contracts;
using TotallyWired.Extensions;

namespace TotallyWired.WebApi.Authentication;

internal class CurrentUser : ICurrentUser
{
    private readonly ClaimsPrincipal? _principal;

    public CurrentUser(ClaimsPrincipal? principal = null)
    {
        _principal = principal;
    }

    public Guid? UserId()
    {
        return _principal?.UserId();
    }
}

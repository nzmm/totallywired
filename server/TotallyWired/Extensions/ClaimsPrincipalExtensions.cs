using System.Security.Claims;

namespace TotallyWired.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid? UserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst("tw_userid");
        if (claim is null)
        {
            return null;
        }

        return Guid.TryParse(claim.Value, out var userId) ? userId : null;
    }
}
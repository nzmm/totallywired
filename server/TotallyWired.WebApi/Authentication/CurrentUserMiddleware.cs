namespace TotallyWired.WebApi.Authentication;

public class CurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public CurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, CurrentUserService currentUserService)
    {
        currentUserService.SetCurrentUser(new CurrentUser(context.User));
        await _next(context);
    }
}

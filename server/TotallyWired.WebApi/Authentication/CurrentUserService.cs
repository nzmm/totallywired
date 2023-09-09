using TotallyWired.Contracts;

namespace TotallyWired.WebApi.Authentication;

public class CurrentUserService
{
    private static readonly CurrentUser Anon = new();
    public ICurrentUser CurrentUser { get; private set; } = Anon;

    public void SetCurrentUser(ICurrentUser currentUser)
    {
        CurrentUser = currentUser;
    }
}

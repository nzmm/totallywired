using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Models;

namespace TotallyWired.WebApi.Services;

public class CurrentUserService : ICurrentUserService
{
    public ICurrentUser CurrentUser { get; private set; } = AnonymousUser.Instance;
    
    public void SetCurrentUser(ICurrentUser currentUser)
    {
        CurrentUser = currentUser;
    }
}
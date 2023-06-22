using TotallyWired.Domain.Contracts;

namespace TotallyWired.Contracts;

public interface ICurrentUserService
{
    void SetCurrentUser(ICurrentUser currentUser);
    ICurrentUser CurrentUser { get; }
}
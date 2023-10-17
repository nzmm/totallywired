using Microsoft.Extensions.DependencyInjection;
using TotallyWired.Contracts;

namespace TotallyWired.ContentProviders.GoogleDrive;

public static class GoogleDriveExtensions
{
    public static IContentProvider AddGoogleDriveContentProvider(
        this IServiceCollection services,
        Action<object> configuration
    )
    {
        throw new NotImplementedException();
    }
}

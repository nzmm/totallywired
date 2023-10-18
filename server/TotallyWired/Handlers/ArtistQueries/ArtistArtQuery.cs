using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistArtQueryHandler(ICurrentUser user, TotallyWiredDbContext context)
    : IAsyncRequestHandler<Guid, string>
{
    private const string DefaultAlbumArt = "/default-art.svg";

    public async Task<string> HandleAsync(Guid artistId, CancellationToken cancellationToken)
    {
        var userId = user.UserId();

        var resource = await context.Artists
            .Where(a => a.Id == artistId && a.UserId == userId)
            .Select(a => new { a.Id, a.ThumbnailUrl })
            .FirstOrDefaultAsync(cancellationToken);

        if (resource is null)
        {
            return DefaultAlbumArt;
        }

        return string.IsNullOrEmpty(resource.ThumbnailUrl)
            ? DefaultAlbumArt
            : resource.ThumbnailUrl;
    }
}

using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.ArtistQueries;

public class ArtistThumbnailQueryHandler : IRequestHandler<Guid, string>
{
    private readonly ICurrentUser _user;
    private readonly TotallyWiredDbContext _context;

    private const string DefaultAlbumArt = "/default-art.svg";

    public ArtistThumbnailQueryHandler(
        ICurrentUser user,
        TotallyWiredDbContext context,
        MicrosoftGraphTokenProvider tokenProvider
    )
    {
        _user = user;
        _context = context;
    }

    public async Task<string> HandleAsync(Guid artistId, CancellationToken cancellationToken)
    {
        var userId = _user.UserId();

        var resource = await _context.Artists
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

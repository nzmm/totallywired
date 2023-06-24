using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.SourceCommands;

public class SourceSyncHandler : IRequestHandler<Guid, (bool, string)>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    private readonly IEnumerable<ISourceIndexer> _indexers;

    public SourceSyncHandler(
        TotallyWiredDbContext context,
        ICurrentUser user,
        IEnumerable<ISourceIndexer> indexers)
    {
        _context = context;
        _user = user;
        _indexers = indexers;
    }

    public async Task<(bool, string)> HandleAsync(Guid sourceId, CancellationToken cancellationToken)
    {
        var source = await _context.Sources
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == sourceId && x.UserId == _user.UserId, cancellationToken: cancellationToken);
        
        if (source is null)
        {
            return (false, $"Source '{sourceId}' does not exist");
        }
        
        foreach (var synchroniser in _indexers)
        {
            var (success, message) = await synchroniser.IndexAsync(source);
            if (success)
            {
                return (success, message);
            }
        }
        
        return (false, $"No handlers configured for source '{source.Id}'");
    }
}
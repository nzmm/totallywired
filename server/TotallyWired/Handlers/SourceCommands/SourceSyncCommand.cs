using MediatR;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Handlers.SourceCommands;

public class SourceSyncCommand : IRequest<(bool, string)>
{
    public Guid SourceId { get; init; }
}

public class SourceSyncHandler : IRequestHandler<SourceSyncCommand, (bool, string)>
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

    public async Task<(bool, string)> Handle(SourceSyncCommand request, CancellationToken cancellationToken)
    {
        var source = await _context.Sources
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == request.SourceId && x.UserId == _user.UserId, cancellationToken: cancellationToken);
        
        if (source is null)
        {
            return (false, $"Source '{request.SourceId}' does not exist");
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
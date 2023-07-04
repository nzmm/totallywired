using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceListHandler : IRequestHandler<IEnumerable<SourceTypeListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public SourceListHandler(ICurrentUser user, TotallyWiredDbContext context)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<SourceTypeListModel>> HandleAsync(CancellationToken cancellationToken)
    {
        var userId = _user.UserId();
        if (userId is null)
        {
            return Enumerable.Empty<SourceTypeListModel>();
        }

        var sources = await _context.Sources
            .Where(x => x.UserId == userId)
            .Select(x => new SourceListModel
            {
                SourceId = x.Id,
                SourceType = x.Type,
                CreatedOn = x.Created,
                ModifiedOn = x.Modified,
                TrackCount = x.Tracks.Count()
            })
            .GroupBy(x => x.SourceType, x => x)
            .ToDictionaryAsync(x => x.Key, x => x.ToArray(), cancellationToken);

        return Enum.GetValues<SourceType>()
            .Where(t => t != SourceType.None)
            .Select(t =>
            {
                sources.TryGetValue(t, out var typedSources);
                return new SourceTypeListModel
                {
                    SourceType = t,
                    Providers = typedSources ?? Enumerable.Empty<SourceListModel>()
                };
            });
    }
}
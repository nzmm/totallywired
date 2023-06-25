using Microsoft.EntityFrameworkCore;
using TotallyWired.Contracts;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceListQuery
{
}

public class SourceListHandler : IRequestHandler<SourceListQuery, IEnumerable<SourceTypeListModel>>
{
    private readonly TotallyWiredDbContext _context;
    private readonly ICurrentUser _user;
    
    public SourceListHandler(TotallyWiredDbContext context, ICurrentUser user)
    {
        _context = context;
        _user = user;
    }

    public async Task<IEnumerable<SourceTypeListModel>> HandleAsync(SourceListQuery _, CancellationToken cancellationToken)
    {
        var sources = await _context.Sources
            .Where(x => x.UserId == _user.UserId)
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
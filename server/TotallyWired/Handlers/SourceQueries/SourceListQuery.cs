using MediatR;
using Microsoft.EntityFrameworkCore;
using TotallyWired.Domain.Contracts;
using TotallyWired.Domain.Enums;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Models;

namespace TotallyWired.Handlers.SourceQueries;

public class SourceListQuery : IRequest<IEnumerable<SourceTypeListModel>>
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

    public async Task<IEnumerable<SourceTypeListModel>> Handle(SourceListQuery _, CancellationToken cancellationToken)
    {
        var sources = await _context.Sources
            .Where(x => x.UserId == _user.UserId)
            .Select(x => new SourceListModel
            {
                SourceId = x.Id,
                SourceType = x.Type,
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
                    Sources = typedSources ?? Enumerable.Empty<SourceListModel>()
                };
            });
    }
}
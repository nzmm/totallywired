namespace TotallyWired.Domain.Contracts;

public interface ISourceSpecific : IEntity
{
    public Guid SourceId { get; set; }
}

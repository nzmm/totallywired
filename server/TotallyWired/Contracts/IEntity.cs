namespace TotallyWired.Domain.Contracts;

public interface IEntity
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
}

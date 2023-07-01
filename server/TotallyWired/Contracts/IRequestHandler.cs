namespace TotallyWired.Contracts;

public interface IRequestHandler<TResponse>
{
    Task<TResponse> HandleAsync(CancellationToken cancellationToken);
}

public interface IRequestHandler<in TRequest, TResponse>
{
    Task<TResponse> HandleAsync(TRequest request, CancellationToken cancellationToken);
}
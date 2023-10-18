namespace TotallyWired.Contracts;

public interface IRequestHandler<out TResponse>
{
    TResponse Handle();
}

public interface IRequestHandler<in TRequest, out TResponse>
{
    TResponse Handle(TRequest request);
}

public interface IAsyncRequestHandler<TResponse>
{
    Task<TResponse> HandleAsync(CancellationToken cancellationToken);
}

public interface IAsyncRequestHandler<in TRequest, TResponse>
{
    Task<TResponse> HandleAsync(TRequest request, CancellationToken cancellationToken);
}

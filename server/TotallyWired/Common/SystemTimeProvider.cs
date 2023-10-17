using TotallyWired.Contracts;

namespace TotallyWired.Common;

public class SystemTimeProvider : ITimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}

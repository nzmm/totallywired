using TotallyWired.Contracts;

namespace TotallyWired.Common;

public class UtcProvider : IUtcProvider
{
    public System.DateTime UtcNow => System.DateTime.UtcNow;
}
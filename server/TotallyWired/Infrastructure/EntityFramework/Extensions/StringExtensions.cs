namespace TotallyWired.Infrastructure.EntityFramework.Extensions;

public static class StringExtensions
{
    /// <summary>
    /// Returns a Postgre tsquery
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public static string TsQuery(this string? s)
    {
        return s is null ? string.Empty : string
            .Join(" & ", s.Trim().Split(" ")
            .Where(x => !string.IsNullOrEmpty(x))
            .Select(t => $"{t}:*")
            .TakeLast(10));
    }
}
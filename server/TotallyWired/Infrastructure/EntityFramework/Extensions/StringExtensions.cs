namespace TotallyWired.Infrastructure.EntityFramework.Extensions;

public static class StringExtensions
{
    /// <summary>
    /// Returns a Postgre tsquery
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public static string TsQuery(this string s)
    {
        return string
            .Join(" & ", s.Split(" ")
            .Where(x => !string.IsNullOrEmpty(x))
            .Select(t => $"{t}:*")
            .TakeLast(10));
    }
}
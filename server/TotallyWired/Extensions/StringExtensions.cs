namespace TotallyWired.Extensions;

public static class StringExtensions
{
    public static string NotNull(this string s, string defaultString = "")
    {
        return string.IsNullOrEmpty(s) ? string.IsNullOrEmpty(defaultString) ? string.Empty : defaultString : s;
    }
}
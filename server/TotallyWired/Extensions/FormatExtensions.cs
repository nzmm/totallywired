namespace TotallyWired.Extensions;

public static class FormatExtensions
{
    public static string DisplayDuration(this TimeSpan ts)
    {
        var h = (long)ts.TotalHours;
        return h >= 1
            ? $"{h:D1}:{ts.Minutes:D2}:{ts.Seconds:D2}"
            : $"{ts.Minutes:D1}:{ts.Seconds:D2}";
    }
}

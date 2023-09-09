// ReSharper disable InconsistentNaming
namespace TotallyWired.Models;

public class TokenResultModel
{
    public string token_type { get; set; } = default!;
    public string scope { get; set; } = default!;
    public string refresh_token { get; set; } = default!;
    public string access_token { get; set; } = default!;
    public int ext_expires_in { get; set; } = 0;
}

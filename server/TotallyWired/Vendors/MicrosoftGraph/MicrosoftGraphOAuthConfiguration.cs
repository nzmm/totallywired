namespace TotallyWired.Vendors.MicrosoftGraph;

public class MicrosoftGraphOAuthConfiguration
{
    public string Authority { get; set; } = default!;
    public string ClientId { get; set; } = default!;
    public string ClientSecret { get; set; } = default!;
    public string RedirectUri { get; set; } = default!;
    public string Scope { get; set; } = default!;
}
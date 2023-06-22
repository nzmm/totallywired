namespace TotallyWired.WebApi;

public abstract class IdentityProviderConfiguration
{
    public string Authority { get; set; } = default!;
    public string ClientId { get; set; } = default!;
    public string CallbackPath { get; set; } = default!;
}

public class MicrosoftIdentityProviderConfiguration : IdentityProviderConfiguration
{
}
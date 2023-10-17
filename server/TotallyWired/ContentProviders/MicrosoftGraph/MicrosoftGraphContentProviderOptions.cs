using TotallyWired.ContentProviders.OAuth;

namespace TotallyWired.ContentProviders.MicrosoftGraph;

public class MicrosoftGraphContentProviderOptions : OAuthCommonOptions
{
    public bool Enabled { get; set; }
}

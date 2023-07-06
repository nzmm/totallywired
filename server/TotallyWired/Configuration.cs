using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.OAuth;

namespace TotallyWired;

public class ConnectionStrings
{
    public string? Postgres { get; set; }
}

public class AuthenticationProviders
{
    public OAuthConfiguration? Microsoft { get; set; }
    public OAuthConfiguration? Google { get; set; }
}

public class ContentProviders
{
    public MicrosoftGraphIndexerOptions? Microsoft { get; set; }
}

public class TotallyWiredConfiguration
{
    public ConnectionStrings ConnectionStrings = new();
    
    public AuthenticationProviders AuthenticationProviders = new();
    
    public ContentProviders ContentProviders = new();
    
    public bool EnableProxy { get; set; }
}
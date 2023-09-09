using Microsoft.AspNetCore.HttpOverrides;
using TotallyWired;
using TotallyWired.Indexers.MicrosoftGraph;
using TotallyWired.WebApi.Routes;
using TotallyWired.WebApi.Authentication;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

var proxyEnabled = config.GetValue<bool>("EnableProxy");

// Add services to the container.
builder.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(opts => opts.HeaderName = "X-XSRF-Token");

builder.Services.AddSingleton(
    new HttpClient(new SocketsHttpHandler { PooledConnectionLifetime = TimeSpan.FromMinutes(2) })
);

var msIndexerOpts = new MicrosoftGraphIndexerOptions();
config.GetSection("ContentProviders:Microsoft").Bind(msIndexerOpts);

builder.Services.AddSingleton(msIndexerOpts);
builder.Services.AddCoreServices(config);
builder.Services.AddCurrentUser();

// Configure the HTTP request pipeline.
var app = builder.Build();

if (proxyEnabled)
{
    app.UseForwardedHeaders(
        new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.All }
    );
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseCurrentUser();

app.MapAuthRoutes();
app.MapSecurityRoutes();
app.MapUserRoutes();
app.MapProviderRoutes();
app.MapArtistRoutes();
app.MapReleaseRoutes();
app.MapTrackRoutes();
app.MapFallbackToFile("index.html");

app.Services.PrepareDatabase();
app.Run();

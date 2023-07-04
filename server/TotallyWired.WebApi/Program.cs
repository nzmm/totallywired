using Microsoft.AspNetCore.HttpOverrides;
using TotallyWired;
using TotallyWired.WebApi.Routes;
using TotallyWired.WebApi.Authentication;
using TotallyWired.Indexers.MicrosoftGraph;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Add services to the container.
builder.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(opts => opts.HeaderName = "X-XSRF-Token");

builder.Services.AddSingleton(new HttpClient(new SocketsHttpHandler
{
    PooledConnectionLifetime = TimeSpan.FromMinutes(2)
}));

// todo
var msOauthConfig = new MicrosoftGraphOAuthConfiguration();
config.GetSection("ContentProviders:Microsoft").Bind(msOauthConfig);
builder.Services.AddSingleton(msOauthConfig);
builder.Services.AddCoreServices(config);
builder.Services.AddCurrentUser();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.All;
});

// Configure the HTTP request pipeline.
var app = builder.Build();

app.UseForwardedHeaders();
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

app.Run();

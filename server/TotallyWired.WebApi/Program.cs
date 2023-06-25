using DbMigrator;
using TotallyWired;
using TotallyWired.Common;
using TotallyWired.ContentProviders.MicrosoftGraph;
using TotallyWired.Contracts;
using TotallyWired.WebApi.Auth;
using TotallyWired.WebApi.Middleware;
using TotallyWired.WebApi.Routes;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Add services to the container.
builder.Services.AddTotallyWiredDataStores(config);
builder.Services.AddTotallyWiredAuthentication(config);
builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(opts => opts.HeaderName = "X-XSRF-Token");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(new HttpClient(new SocketsHttpHandler
{
    PooledConnectionLifetime = TimeSpan.FromMinutes(2)
}));

builder.Services.AddSingleton<IUtcProvider, UtcProvider>();
builder.Services.AddScoped<CurrentUserMiddleware>();
builder.Services.AddScoped<MicrosoftGraphOAuthUriHelper>();
builder.Services.AddScoped<MicrosoftGraphTokenProvider>();
builder.Services.AddScoped<MicrosoftGraphClientProvider>();
builder.Services.AddTotallyWiredHandlers();

builder.Services.AddTransient<ISourceIndexer, MicrosoftGraphSourceIndexer>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the HTTP request pipeline.
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseTotallyWiredAuthentication();

app.MapAuthRoutes();
app.MapUserRoutes();
app.MapProviderRoutes();
app.MapArtistRoutes();
app.MapReleaseRoutes();
app.MapTrackRoutes();

app.Run();

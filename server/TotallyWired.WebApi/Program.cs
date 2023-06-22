using MediatR;
using TotallyWired.Common;
using TotallyWired.Contracts;
using TotallyWired.Handlers.SourceCommands;
using TotallyWired.Infrastructure.EntityFramework;
using TotallyWired.Vendors.MicrosoftGraph;
using TotallyWired.WebApi.Middleware;
using TotallyWired.WebApi.Routing;
using TotallyWired.WebApi.Routing.Api.v1;
using TotallyWired.WebApi.Services;

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

builder.Services.AddMediatR(typeof(SourceSyncHandler).Assembly);
builder.Services.AddScoped<CurrentUserMiddleware>();
builder.Services.AddSingleton<IUtcProvider, UtcProvider>();
builder.Services.AddScoped<MicrosoftGraphOAuthUriHelper>();
builder.Services.AddScoped<MicrosoftGraphTokenProvider>();
builder.Services.AddScoped<MicrosoftGraphClientProvider>();

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
app.MapSourceRoutes();
app.MapArtistRoutes();
app.MapReleaseRoutes();
app.MapTrackRoutes();

app.Run();

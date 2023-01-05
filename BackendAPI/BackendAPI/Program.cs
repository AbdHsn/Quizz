using BackendAPI.SignalREndPoints;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.EntityFrameworkCore;
using RepositoryLayer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddDbContext<EntityContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:DefaultConnection"]);
});

builder.Services.AddSignalR(hubOptions =>
{
    hubOptions.EnableDetailedErrors = true;
    hubOptions.KeepAliveInterval = TimeSpan.FromMinutes(30);
    hubOptions.HandshakeTimeout = TimeSpan.FromMinutes(30);
    hubOptions.ClientTimeoutInterval = TimeSpan.FromMinutes(30);
});

#region DI
builder.Services.AddTransient(typeof(IEntityRepo<>), typeof(EntityRepo<>));
#endregion

string CorsPolicy = "CorsPolicy";
builder.Services.AddCors(options => options.AddPolicy(name: CorsPolicy,
    builder =>
    {
         builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins("http://localhost:4200",
                             "https://localhost:4200")
                .WithMethods("POST", "GET", "PUT", "DELETE");
    }));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseCors(CorsPolicy);
app.UseCors(s => s.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapControllers();

app.MapHub<BroadcastHub>("/broadcast-message", options =>
{
    options.Transports = HttpTransportType.ServerSentEvents |
                         HttpTransportType.LongPolling |
                         HttpTransportType.WebSockets;
}).RequireCors(CorsPolicy);



app.Run();

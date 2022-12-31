using BackendAPI.SignalREndPoints;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.EntityFrameworkCore;
using RepositoryLayer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

//builder.Services.AddTransient<IEntityRepo, EntityRepo>();
builder.Services.AddDbContext<EntityContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:DefaultConnection"]);
});

#region DI
builder.Services.AddTransient(typeof(IEntityRepo<>), typeof(EntityRepo<>));
//builder.Services.AddTransient<TasksApi>();
#endregion

string CorsPolicy = "CorsPolicy";
builder.Services.AddCors(options => options.AddPolicy(name: CorsPolicy,
    builder =>
    {
        builder.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowAnyOrigin()
               .WithMethods("POST", "GET", "PUT", "DELETE");
    }));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);
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

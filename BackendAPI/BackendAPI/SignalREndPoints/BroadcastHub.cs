using Microsoft.AspNetCore.SignalR;

namespace BackendAPI.SignalREndPoints
{
    public class BroadcastHub : Hub<IHubClient>
    {
    }
}

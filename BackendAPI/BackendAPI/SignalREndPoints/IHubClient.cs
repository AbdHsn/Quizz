
public interface IHubClient
{    
    Task BroadcastMessage(string obj);
}
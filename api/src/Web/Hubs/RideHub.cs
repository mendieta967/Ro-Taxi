using Application.Models;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Web.Hubs;

public class RideHub : Hub
{
    private static int _connectedDriversCount = 0;
    public override async Task OnConnectedAsync()
    {
        var user = Context.User;
        if (user?.Identity?.IsAuthenticated != true)
        {
            Context.Abort();
            return;
        }
        var role = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value;
        Console.WriteLine($"Usuario conectado: {user.Identity.Name}");
        if (role == UserRole.Driver.ToString())
        {
            _connectedDriversCount++;
            await Groups.AddToGroupAsync(Context.ConnectionId, "drivers");
            await Clients.All.SendAsync("UpdateDriversCount", _connectedDriversCount);

        }
        await base.OnConnectedAsync();

    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Usuario desconectado: {Context.User?.Identity?.Name}");
        var role = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value;
        if (role == UserRole.Driver.ToString())
        {
            _connectedDriversCount = Math.Max(0, _connectedDriversCount - 1);
            await Clients.All.SendAsync("UpdateDriversCount", _connectedDriversCount);
        }        
        await base.OnDisconnectedAsync(exception);
    }   

    public async Task JoinRideGroup(int rideId)
    {
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value; 
        await Groups.AddToGroupAsync(Context.ConnectionId, $"ride-{rideId}");
        Console.WriteLine($"{role} {Context.User?.Identity?.Name} se unió al ride {rideId}");
    }

    public async Task LeaveRideGroup(int rideId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ride-{rideId}");
        Console.WriteLine($"Connection {Context.ConnectionId} left ride-{rideId}");
    }

    public async Task UpdateLocation(int rideId, double lat, double lng)
    {
        await Clients.OthersInGroup($"ride-{rideId}").SendAsync("DriverLocationUpdated", new
        {
            RideId = rideId,
            Lat = lat,
            Lng = lng
        });
    }
}

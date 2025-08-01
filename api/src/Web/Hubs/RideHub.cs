using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Web.Hubs;

public class RideHub : Hub
{
    private static int _connectedDriversCount = 0;
    private static readonly Dictionary<int, DateTime> _lastUpdateTimestamps = new();
    private static readonly object _lock = new();
    private readonly IMessageService _messageService;
    private readonly IVehicleService _vehicleService;

    public RideHub(IMessageService messageService, IVehicleService vehicleService)
    {
        _messageService = messageService;
        _vehicleService = vehicleService;
    }
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
        //var role = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)!.Value;
        //if (role == UserRole.Driver.ToString())
        //{
        //    _connectedDriversCount = Math.Max(0, _connectedDriversCount - 1);
        //    await Clients.All.SendAsync("UpdateDriversCount", _connectedDriversCount);
        //}        
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

    public async Task JoinVehicleGroup(int vehicleId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"vehicle-{vehicleId}");
    }

    public async Task LeaveVehicleGroup(int vehicleId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"vehicle-{vehicleId}");
    }

    public async Task UpdateLocation(int vehicleId, int? rideId, double lat, double lng)
    {
        int userId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found"));
        var location = new
        {
            RideId = rideId,
            Lat = lat,
            Lng = lng
        };

        bool shouldUpdateDb = false;

        lock (_lock)
        {
            if (_lastUpdateTimestamps.TryGetValue(vehicleId, out var lastUpdate))
            {
                var secondsSinceLastUpdate = (DateTime.UtcNow - lastUpdate).TotalSeconds;
                if (secondsSinceLastUpdate > 10)
                {
                    shouldUpdateDb = true;
                    _lastUpdateTimestamps[vehicleId] = DateTime.UtcNow;
                }
            }
            else
            {
                shouldUpdateDb = true;
                _lastUpdateTimestamps[vehicleId] = DateTime.UtcNow;
            }
        }

        if (shouldUpdateDb)
        {
            await _vehicleService.UpdateLocation(userId, vehicleId, lat, lng);
        }

        if (rideId.HasValue)
        {
            await Clients.Group($"ride-{rideId}").SendAsync("DriverLocationUpdated", location);
        }

        await Clients.OthersInGroup($"vehicle-{vehicleId}").SendAsync("DriverLocationUpdated", location);

    }

    public async Task SendMessageToRideGroup(int rideId, string text)
    {
        int userId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found"));
        Console.WriteLine($"mensaje enviado:{text}");
        var message = await _messageService.Create(userId, rideId, text);
        await Clients.Group($"ride-{rideId}").SendAsync("ReceiveRideMessage", message);
    }
}

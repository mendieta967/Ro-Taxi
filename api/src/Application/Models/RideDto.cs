using Domain.Entities;
using Domain.Enums;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class RideDto
{
    public int Id { get; set; }
    public UserDto Passeger { get; set; }
    public UserDto? Driver { get; set; }
    public VehicleDto? Vehicle { get; set; }
    public string OriginAddress { get; set; }
    public string DestinationAddress { get; set; }
    public Payment Payment { get; set; }
    public int? Rating { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string Status { get; set; }

    public RideDto(Ride ride)
    {
        Id = ride.Id;
        Passeger = new UserDto(ride.Passeger);
        Driver = ride.Driver != null ? new UserDto(ride.Driver) : null;
        Vehicle = ride.Vehicle != null ? new VehicleDto(ride.Vehicle) : null;
        OriginAddress = ride.OriginAddress;
        DestinationAddress = ride.DestinationAddress;
        Payment = ride.Payment;
        Rating = ride.Rating;
        RequestedAt = ride.RequestedAt;
        ScheduledAt = ride.ScheduledAt;
        StartedAt = ride.StartedAt;
        EndedAt = ride.EndedAt;
        Status = ride.Status.ToString();

    }
}



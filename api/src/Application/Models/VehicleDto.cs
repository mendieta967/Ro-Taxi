using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class VehicleDto
{

    public int Id { get; set; }
    public string LicensePlate { get; set; }
    public string Model { get; set; }
    public string Brand { get; set; }
    public string Color { get; set; }
    public string Year { get; set; }
    public UserDto? Driver { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public VehicleDto(Vehicle vehicle)
    {
        Id = vehicle.Id;
        LicensePlate = vehicle.LicensePlate;
        Model = vehicle.Model;
        Brand = vehicle.Brand;
        Color = vehicle.Color;
        Year = vehicle.Year;
        Driver = new UserDto(vehicle.Driver);
        Status = vehicle.Status.ToString();
        CreatedAt = vehicle.CreatedAt;

    }
}

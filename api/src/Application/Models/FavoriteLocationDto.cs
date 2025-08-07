using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class FavoriteLocationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime CreatedAt { get; set; }

    public FavoriteLocationDto(FavoriteLocation location)
    {
        Id = location.Id;
        UserId = location.UserId;
        Name = location.Name;
        Address = location.Address;
        Latitude = location.Latitude;
        Longitude = location.Longitude;
        CreatedAt = location.CreatedAt;
    }
}

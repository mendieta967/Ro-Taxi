using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class Ride
{
    public int Id { get; set; }
    public int PassegerId { get; set; }
    public User Passeger { get; set; }
    public int? DriverId { get; set; }
    public User Driver { get; set; }
    public string OriginAddress { get; set; }
    public double OriginLat { get; set; }
    public double OriginLng { get; set; }
    public string DestinationAddress { get; set; }
    public double DestinationLat { get; set; }
    public double DestinationLng { get; set; }
    public int? OriginFavoritePlaceId { get; set; }
    public FavoritePlace? OriginFavoritePlace { get; set; }
    public int? DestinationFavoritePlaceId { get; set; }
    public FavoritePlace? DestinationFavoritePlace { get; set; }
    public decimal EstimatedPrice { get; set; }
    public int PaymentId {  get; set; }
    public Payment Payment { get; set; }
    public int? Rating { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public RideStatus Status { get; set; }

}

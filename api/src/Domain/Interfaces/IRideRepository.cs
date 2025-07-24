using Application.Models;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IRideRepository
{
    Task<PaginatedList<Ride>> GetAll(int? userId, int pageIndex, int pageSize, RideStatus? status, string? search, DateOnly? date);
    Task<PaginatedList<Ride>> GetSchedules(int pageIndex, int pageSize, double driverLat, double driverLng, int driverId);
    Task<Ride?> GetPending(int driverId, double driverLat, double driverLng);
    Task<Ride?> GetById(int rideId);
    Task<int> ExpireRides(CancellationToken cancellationToken = default);
    Task Create(Ride ride);
    void Update(Ride ride);
    void Delete(Ride ride);


}

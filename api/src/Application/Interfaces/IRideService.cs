using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IRideService
{
    Task<PaginatedList<RideDto>> GetAll(int userId, PaginationParams pagination, RideFilterParams filter);
    Task<RideDto> Create(int userId, RideCreateRequest request);
    Task<PaginatedList<RideDto>> GetSchedules(int userId, PaginationParams pagination, GetSchedulesForDriverRequest request);
    Task<RideDto?> GetPending(int userId, double driverLat, double driverLng);
    Task<List<RideDto>> GetInProgress(int userId);
    Task Update(int userId, int rideId, RideUpdateRequest request);
    Task Reject(int userId, int rideId);
    Task<RideDto> Accept(int userId, int rideId, RideAcceptRequest request);
    Task<Ride> Cancel(int userId, int rideId);
    Task<Ride> Complete(int userId, int rideId);
    Task RateRide(int userId, int rideId, int rating);
    decimal CalculatePrice(CalculatePriceRequest request);
    Task<PaginatedList<RideWithMessageDto>> GetWithMessages(int userId, PaginationParams pagination);
}

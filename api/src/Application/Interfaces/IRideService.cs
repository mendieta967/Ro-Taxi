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
    Task<RideDto> CreateScheduleRide(int userId, RideCreateRequest request);
    Task<PaginatedList<RideDto>> GetSchedulesForDriver(int userId, PaginationParams pagination, GetSchedulesForDriverRequest request);
    Task Update(int userId, int rideId, RideUpdateRequest request);
    Task Accept(int userId, int rideId);
    Task Cancel(int userId, int rideId);
    Task Complete(int userId, int rideId);
    Task RateRide(int userId, int rideId, int rating);
    decimal CalculatePrice(CalculatePriceRequest request);
}

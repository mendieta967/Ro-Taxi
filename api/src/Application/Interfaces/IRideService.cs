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
    Task<PaginatedList<Ride>> GetAll(int userId, PaginationParams pagination, RideFilterParams filter);
    Task<Ride> CreateScheduleRide(int userId, RideCreateRequest request);
    Task Update(int userId, int rideId, RideUpdateRequest request);
    Task Cancel(int userId, int rideId);
    decimal CalculatePrice(CalculatePriceRequest request);
}

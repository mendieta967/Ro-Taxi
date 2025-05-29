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
    Task<List<Ride>> GetAll(UserRole role, int userId);
    Task<Ride> CreateScheduleRide(int userId, RideCreateRequest request);
}

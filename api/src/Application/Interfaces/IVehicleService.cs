using Application.Models.Parameters;
using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IVehicleService
{
    Task<PaginatedList<VehicleDto>> GetAll(int userId, PaginationParams pagination);
    Task<Vehicle> Create(int userId, VehicleCreateRequest request);
    Task<VehicleDto> Update(VehicleUpdateRequest request, int userId, int vehicleId);
    Task Delete(int userId, int vehicleId);
}

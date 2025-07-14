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
    public Task<PaginatedList<VehicleDto>> GetAll(int userId, PaginationParams pagination);
    public Task<Vehicle> Create(int userId, VehicleCreateRequest request);
}

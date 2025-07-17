using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IVehicleRepository
{
    public Task<PaginatedList<Vehicle>> GetAll(int? driverId, int pageNumber, int pageSize, string licensePlate);
    public Task<Vehicle?> GetById(int id);
    public  Task<Vehicle> Create(Vehicle vehicle);
    public void Update(Vehicle vehicle);
}

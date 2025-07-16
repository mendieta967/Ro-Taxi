using Application.Models;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class VehicleRepository: IVehicleRepository
{
    private readonly ApplicationDbContext _context;
    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<Vehicle>> GetAll(int? driverId, int pageNumber, int pageSize)
    {
        var query = _context.Vehicles.AsNoTracking().Include(v => v.Driver).AsQueryable();

        if (driverId.HasValue)
            query = query.Where(v => v.DriverId == driverId);

        query = query.OrderBy(v => v.Id);

        var totalData = await query.CountAsync();

        var data = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

        return new PaginatedList<Vehicle>(data, totalData, pageNumber, pageSize, totalPages);
    }

    public async Task<Vehicle?> GetById(int id)
    {
        return await _context.Vehicles.FindAsync(id);
    }

    public async Task<Vehicle> Create(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
        return vehicle;
    }

    public void Update(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
    }
}

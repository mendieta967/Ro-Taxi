using Application.Models;
using Application.Models.Parameters;
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

    public async Task<PaginatedList<Vehicle>> GetAll(int? driverId, int pageNumber, int pageSize, string? licensePlate)
    {
        var query = _context.Vehicles.AsNoTracking().Include(v => v.Driver).AsQueryable();

        if (driverId.HasValue)
            query = query.Where(v => v.DriverId == driverId);

        if (!string.IsNullOrEmpty(licensePlate))
            query = query.Where(v => v.LicensePlate.Contains(licensePlate));

        query = driverId != null 
            ? query.OrderByDescending(v => v.CreatedAt) 
            : query.OrderByDescending(v => v.LastLocationAt != null ? v.LastLocationAt : DateTime.MinValue);

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
        return await _context.Vehicles.Include(v => v.Driver).FirstOrDefaultAsync(v => v.Id == id);
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

using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class RideRepository : IRideRepository
{
    private readonly ApplicationDbContext _context;
    public RideRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Ride>> GetAll()
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .ToListAsync();
    }

    public async Task<List<Ride>> GetAllByPasseger(int id)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .Where(r => r.PassegerId == id).ToListAsync();
    }

    public async Task<List<Ride>> GetAllByDriver(int id)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .Where(r => r.DriverId == id).ToListAsync();
    }

    public async Task Create(Ride ride)
    {
        await _context.Rides.AddAsync(ride);        
    }

    public void Update(Ride ride)
    {
        _context.Rides.Update(ride);
    }
}

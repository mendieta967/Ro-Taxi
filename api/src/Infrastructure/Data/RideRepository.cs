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

public class RideRepository : IRideRepository
{
    private readonly ApplicationDbContext _context;
    public RideRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<Ride>> GetAll(int? userId, int pageIndex, int pageSize, RideStatus? status, string? search, DateOnly? date)
    {
        var query = _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .AsQueryable();

        if (userId != null)
           query = query.Where(r => r.DriverId == userId || r.PassegerId == userId);

        if(status != null)
            query = query.Where(r => r.Status == status);

        if (date != null)
        {
            var start = date.Value.ToDateTime(TimeOnly.MinValue);
            var end = date.Value.ToDateTime(TimeOnly.MaxValue);
            query = query.Where(r =>
                 (r.RequestedAt >= start && r.RequestedAt <= end) ||
                 (r.ScheduledAt >= start && r.ScheduledAt <= end) ||
                 (r.StartedAt >= start && r.StartedAt <= end));
        }
          
        if(!string.IsNullOrEmpty(search))
            query = query.Where(r => 
                r.OriginAddress.Contains(search) || 
                r.DestinationAddress.Contains(search) || 
                r.Passeger.Name.Contains(search) || 
                r.Driver.Name.Contains(search));

        var totalData = await query.CountAsync();

        var rides = await query                       
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

        return new PaginatedList<Ride>(rides, totalData, pageIndex, pageSize, totalPages);
    } 
    public async Task<Ride?> GetById(int rideId)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == rideId);
    }

    public async Task Create(Ride ride)
    {
        await _context.Rides.AddAsync(ride);        
    }

    public void Update(Ride ride)
    {
        _context.Rides.Update(ride);
    }

    public void Delete(Ride ride)
    { 
        _context.Remove(ride);        
    }

}

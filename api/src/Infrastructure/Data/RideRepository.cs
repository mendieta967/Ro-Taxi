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
            .Include(r => r.Driver)
            .Include(r => r.StartFavoriteLocation)
            .Include(r => r.EndFavoriteLocation)
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

        query = query.OrderByDescending(v => v.RequestedAt);

        var totalData = await query.CountAsync();

        var rides = await query                       
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

        return new PaginatedList<Ride>(rides, totalData, pageIndex, pageSize, totalPages);
    }

    public async Task<PaginatedList<Ride>> GetSchedules(int pageIndex, int pageSize, double driverLat, double driverLng, int driverId)
    {
        var query = _context.Rides
        .Include(r => r.Passeger)
        .Include(r => r.Payment)
        .Include(r => r.StartFavoriteLocation)
        .Include(r => r.EndFavoriteLocation)
        .Where(r => r.Status == RideStatus.Pending && 
        r.ScheduledAt > DateTime.UtcNow && 
        r.DriverId == null && 
        !_context.RideRejections.Any(rr => rr.RideId == r.Id && rr.DriverId == driverId)
        );

        query = query.OrderBy(r =>
            (r.OriginLat - driverLat) * (r.OriginLat - driverLat) +
            (r.OriginLng - driverLng) * (r.OriginLng - driverLng)
        );

        var totalData = await query.CountAsync();

        var rides = await query
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

        return new PaginatedList<Ride>(rides, totalData, pageIndex, pageSize, totalPages);
    }

    public async Task<Ride?> GetPending(int driverId, double driverLat, double driverLng)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Payment)
            .Include(r => r.StartFavoriteLocation)
            .Include(r => r.EndFavoriteLocation)
            .Where(r => 
            r.Status == RideStatus.Pending && 
            r.ScheduledAt == null && 
            r.DriverId == null &&
            !_context.RideRejections.Any(rr => rr.RideId == r.Id && rr.DriverId == driverId)
            )
            .OrderBy(r =>
            (r.OriginLat - driverLat) * (r.OriginLat - driverLat) +
            (r.OriginLng - driverLng) * (r.OriginLng - driverLng)
            )
            .Take(1)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Ride>> GetInProgress(int userId)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .Include(r => r.Vehicle)
            .Include(r => r.StartFavoriteLocation)
            .Include(r => r.EndFavoriteLocation)
            .Where(r =>
            r.Status == RideStatus.InProgress &&
            (r.DriverId == userId ||
            r.PassegerId == userId)
            )            
            .ToListAsync();
    }

    public async Task<Ride?> GetById(int rideId)
    {
        return await _context.Rides
            .Include(r => r.Passeger)
            .Include(r => r.Driver)
            .Include(r => r.Payment)
            .Include(r => r.Driver)
            .Include(r => r.StartFavoriteLocation)
            .Include(r => r.EndFavoriteLocation)
            .FirstOrDefaultAsync(r => r.Id == rideId);
    }

    public async Task<int> ExpireRides(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var expiredCount = await _context.Rides
            .Where(r => r.ScheduledAt < now && r.Status == RideStatus.Pending)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.Status, RideStatus.Expired), cancellationToken);
        return expiredCount;
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

    public async Task<PaginatedList<Ride>> GetWithMessages(int driverId, int pageIndex, int pageSize)
    {
        var query = _context.Rides
            .Where(r => r.DriverId == driverId && r.Status == RideStatus.InProgress)
            .Include(r => r.Passeger)           
            .Include(r => r.Messages)
            .AsQueryable();

        query = query.OrderByDescending(r => r.Messages.Any() ? r.Messages.Max(m => m.Timestamp) : DateTime.MinValue);

        var totalData = await query.CountAsync();

        var rides = await query            
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalData / pageSize);

        return new PaginatedList<Ride>(rides, totalData, pageIndex, pageSize, totalPages);
    }
}

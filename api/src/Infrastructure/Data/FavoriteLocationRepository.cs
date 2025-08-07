using Application.Models;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class FavoriteLocationRepository: IFavoriteLocationRepository
{
    private readonly ApplicationDbContext _context;
    public FavoriteLocationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<FavoriteLocation>> GetAll(int userId)
    {
        return await _context.FavoriteLocations
            .Where(f => f.UserId == userId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();        
    }

    public async Task<FavoriteLocation?> GetById(int id)
    {
        return await _context.FavoriteLocations
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<FavoriteLocation> Create(FavoriteLocation location)
    {
        await _context.FavoriteLocations.AddAsync(location);
        return location;
    }

    public void Update(FavoriteLocation location)
    {
        _context.FavoriteLocations.Update(location);
    }

    public void Delete(FavoriteLocation location)
    {
        _context.Remove(location);
    }
}

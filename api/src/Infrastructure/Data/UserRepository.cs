using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class UserRepository: IUserRepository
{
    private readonly ApplicationDbContext _context;
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<User>> GetAll()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetById(int id)
    {
        return await _context.Users.FindAsync();
    }

    public async Task<User> Create(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task Update(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsEmailOrDniTakenAsync(string email, string dni)
    {
        return await _context.Users.AnyAsync(u => u.Email == email || u.Dni == dni);
    }

    public async Task<User?> GetByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<User?> GetByRefreshToken(string token)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == token);
    }

    public async Task<User?> GetByGithubId(long id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.GithubId == id);
    }
}

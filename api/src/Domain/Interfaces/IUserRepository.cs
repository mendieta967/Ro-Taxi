using Application.Models;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IUserRepository
{
    public Task<PaginatedList<User>> GetAll(int currentPage, int pageSize, UserRole? role, string? search);
    public Task<User?> GetById(int id);
    public Task<User> Create(User user);
    public Task Update(User user);
    public Task<bool> IsEmailOrDniTakenAsync(string email, string dni);
    public Task<User?> GetByEmail(string email);
    public Task<User?> GetByDni(string dni);
    public Task<User?> GetByRefreshToken(string token);
    public Task<User?> GetByGithubId(long id);


}

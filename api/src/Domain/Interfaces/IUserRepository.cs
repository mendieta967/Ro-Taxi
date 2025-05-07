using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IUserRepository
{
    public Task<List<User>> GetAll();
    public Task<User?> GetById(int id);
    public Task<User> Create(User user);
    public Task Update(User user);
    public Task<bool> IsEmailOrDniTakenAsync(string email, string dni);
    public Task<User?> GetByEmail(string email);
    public Task<User?> GetByRefreshToken(string token);
    public Task<User?> GetByGithubId(string id);


}

using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IUserService
{
    public Task<List<User>> GetAll();
    public Task Create(RegisterRequest registerRequest);
    public Task Create(GithubUserDto userData);
}

using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IUserService
{
    public Task<PaginatedList<UserDto>> GetAll(PaginationParams paginationParams, UserFilterParams filter);
    public Task<UserDto> GetById(int id);
    public Task Create(RegisterRequest registerRequest);
    public Task Create(GithubUserDto userData);
    public Task CompleteAccount(CompleteAccountRequest completeAccountRequest, int userId);
    public Task ChangePassword(ChangePasswordRequest changePasswordRequest, int userId);
}

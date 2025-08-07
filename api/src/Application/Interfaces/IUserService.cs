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
    Task<PaginatedList<UserDto>> GetAll(PaginationParams paginationParams, UserFilterParams filter);
    Task<UserDto> GetById(int id);
    Task Create(RegisterRequest registerRequest);
    Task Create(GithubUserDto userData);
    Task CompleteAccount(CompleteAccountRequest completeAccountRequest, int userId);
    Task ChangePassword(ChangePasswordRequest changePasswordRequest, int userId);
    Task<UserDto> Update(UserUpdateRequest request, int authUserId, int paramUserId);
    Task ChangeStatus(int authUserId, int paramUserId);
    Task DeleteAccount(int userId, ValidateUserRequest request);
    Task ForgotPassword(string email);
    Task ResetPassword(string token, string newPassword);

}

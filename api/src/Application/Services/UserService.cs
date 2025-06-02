using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Domain.Exceptions;
using Domain.Enums;
using Application.Models.Requests;
using Application.Models.Parameters;

namespace Application.Services;

public class UserService: IUserService
{
    private readonly IUserRepository _userRepository;
    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<PaginatedList<UserDto>> GetAll(PaginationParams pagination, UserFilterParams filter)
    {
        UserRole? role = null;
        if (!string.IsNullOrEmpty(filter.Role))
        {
            if (!Enum.TryParse<UserRole>(filter.Role, true, out var parsedRole))
                throw new Exception("Invalid role filter.");
            role = parsedRole;
        }

        var response = await _userRepository.GetAll(pagination.Page, pagination.PageSize, role, filter.Search);
        var data = response.Data.Select(user => new UserDto(user)).ToList();
        return new PaginatedList<UserDto>(data, response.TotalData, response.PageNumber, response.PageSize, response.TotalPages);
    }

    public async Task<UserDto> GetById(int id)
    {
        var user = await _userRepository.GetById(id) ?? throw new NotFoundException("user not found");
        return new UserDto(user);
    }

    public async Task Create(RegisterRequest registerRequest)
    {
        var existingUser = await _userRepository.IsEmailOrDniTakenAsync(registerRequest.Email, registerRequest.Dni);
        if (existingUser) throw new AlreadyRegisteredException("Email or Dni are already registered.");
        User user = new();
        user.AuthProvider = AuthProvider.Local;
        user.Email = registerRequest.Email;
        user.Dni = registerRequest.Dni;
        user.Role = registerRequest.Role;
        user.Genre = registerRequest.Genre;
        user.Name = registerRequest.Name;
        user.Password = new PasswordHasher<User>().HashPassword(user, registerRequest.Password);
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        user.AccountStatus = AccountStatus.Active;
        await _userRepository.Create(user);
    }

    public async Task Create(GithubUserDto userData)
    {
        var existingUser = await _userRepository.GetByEmail(userData.Email);
        if (existingUser is not null) throw new AlreadyRegisteredException("Email already registered.");
        User user = new();
        user.AuthProvider = AuthProvider.Github;
        user.GithubId = userData.Id;
        user.Email = userData.Email;
        user.Name = userData.Name;
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        user.AccountStatus = AccountStatus.Pending;
        await _userRepository.Create(user);
    }

    public async Task CompleteAccount(CompleteAccountRequest completeAccountRequest, int userId)
    {
        User user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        if (user.AccountStatus != AccountStatus.Pending) throw new Exception("user status is not pending");
        var existingDni = await _userRepository.GetByDni(completeAccountRequest.Dni);
        if (existingDni is not null) throw new AlreadyRegisteredException("DNI already registered.");
        user.Dni = completeAccountRequest.Dni;
        user.Genre = completeAccountRequest.Genre;
        user.Role = completeAccountRequest.Role;
        user.AccountStatus = AccountStatus.Active;
        await _userRepository.Update(user);
    }

    public async Task ChangePassword(ChangePasswordRequest changePasswordRequest, int userId)
    {
        User user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");

        var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, changePasswordRequest.OldPassword);
        if (result != PasswordVerificationResult.Success) throw new NotFoundException("Old password is invalid");

        user.Password = new PasswordHasher<User>().HashPassword(user, changePasswordRequest.NewPassword);
        await _userRepository.Update(user);
    }
}

using Application.Models;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Application.Interfaces;
using System.Reflection.Metadata;
using Domain.Enums;
using Application.Models.Requests;

namespace Infrastructure.Services;

public class AuthService: IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly AuthServiceOptions _options;
    private readonly IUnitOfWork _unitOfWork;
    public AuthService(IUserRepository userRepository, IOptions<AuthServiceOptions> options, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _options = options.Value;
        _unitOfWork = unitOfWork;
    }
    public async Task<AuthDto> Login(LoginRequest loginRequest)
    {
        var user = await ValidateUser(loginRequest);
        return new AuthDto
        {
            AccessToken = GenerateAccessToken(user),
            RefreshToken = await GenerateRefreshToken(user)
        };
    }

    public async Task<AuthDto> RefreshToken(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshToken(refreshToken);
        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow || user.AccountStatus != AccountStatus.Active)
        {
            throw new SecurityTokenException("Refresh token is invalid or expired.");
        }
        return new AuthDto
        {
            AccessToken = GenerateAccessToken(user),
            RefreshToken = await GenerateRefreshToken(user)
        };
    }
    public async Task<string> UpdateAccessTokenById(int userId)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        return GenerateAccessToken(user);
    }
    public async Task Logout(int userId)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("Session not found");
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<AuthDto?> LoginWithGithub(GithubUserDto userData)
    {
        var user = await _userRepository.GetByGithubId(userData.Id);
        if (user is not null)
        {
            if(user.AccountStatus != AccountStatus.Active) throw new SecurityTokenException("Banned Account");
            if (user.Email != userData.Email)
            {
                user.Email = userData.Email;
                _userRepository.Update(user);
                await _unitOfWork.SaveChangesAsync();
            }
            return new AuthDto
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = await GenerateRefreshToken(user)
            };
        }
        return null;
    }
    private async Task<User> ValidateUser(LoginRequest loginRequest)
    {
        var user = await _userRepository.GetByEmail(loginRequest.Email);
        if (user is null) throw new NotFoundException("Password or email are invalid");
        if (user.AuthProvider != AuthProvider.Local) throw new Exception("Este usuario fue registrado con " + user.AuthProvider + ". Iniciá sesión con ese método.");
        var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, loginRequest.Password);
        if (result != PasswordVerificationResult.Success) throw new NotFoundException("Password or email are invalid");
        if (user.AccountStatus != AccountStatus.Active) throw new SecurityTokenException("Banned Account");
        return user;
        
        
    }

    private string GenerateAccessToken(User user)
    {
        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("accountStatus", user.AccountStatus.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            },
            DateTime.UtcNow,
            DateTime.UtcNow.AddMinutes(15),
            new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretForKey)),
                SecurityAlgorithms.HmacSha512
                )
            );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<string> GenerateRefreshToken(User user)
    {
        string token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        user.RefreshToken = token;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return token;
    }
}

public class AuthServiceOptions
{
    public const string AuthService = "AuthService";

    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string SecretForKey { get; set; }
}
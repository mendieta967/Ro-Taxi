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
using Infrastructure.Migrations;

namespace Infrastructure.Services;

public class AuthService: IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly AuthServiceOptions _options;
    public AuthService(IUserRepository userRepository, IOptions<AuthServiceOptions> options)
    {
        _userRepository = userRepository;
        _options = options.Value;
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
        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
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
        await _userRepository.Update(user);
    }

    public async Task<AuthDto?> LoginWithGithub(GithubUserDto userData)
    {
        var user = await _userRepository.GetByGithubId(userData.Id);
        if (user is not null)
        {
            if(user.Email != userData.Email)
            {
                user.Email = userData.Email;
                await _userRepository.Update(user);
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
                new Claim("accountStatus", user.AccountStatus.ToString())
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
        await _userRepository.Update(user);
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
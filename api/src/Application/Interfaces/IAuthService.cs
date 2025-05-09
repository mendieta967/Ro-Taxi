using Application.Models;
using Application.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IAuthService
{
    public Task<AuthDto> Login(LoginRequest loginRequest);
    public Task<AuthDto> RefreshToken(string refreshToken);
    public Task<string> UpdateAccessTokenById(int userId);
    public Task Logout(int userId);
    public Task<AuthDto?> LoginWithGithub(GithubUserDto userData);
}

using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

namespace Web.Controllers;

[Route("api")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    public AuthController(IUserService userService, IAuthService authService, IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _userService = userService;
        _authService = authService;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("oauth/{app}")]
    public async Task<IActionResult> OAuth(string app, string code)
    {        
        try
        {          
            string accessToken = await GetGithubToken(code);
            var userData = await GetGithubUser(accessToken);

            var tokens = await _authService.LoginWithGithub(userData);
            if(tokens is null)
            {
                await _userService.Create(userData);
                return Ok("Creado, ahora completar perfil");
            }
            return Ok(new { Token = tokens.AccessToken });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }

    }

    private async Task<string> GetGithubToken(string code)
    {
        Console.WriteLine(code);
        var url = "https://github.com/login/oauth/access_token";
        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "client_id", _configuration["Github:GITHUB_CLIENT_ID"]! },
            { "client_secret", _configuration["Github:GITHUB_CLIENT_SECRET"]! },
            { "redirect_uri", _configuration["Github:REDIRECT_URI"]! },
            { "code", code }
        });
        var client = _httpClientFactory.CreateClient();
        var response = await client.PostAsync(url, content);
        if (!response.IsSuccessStatusCode) throw new Exception("OAuth authentication failed with status code " + response.StatusCode);
        var responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
        var parameters = System.Web.HttpUtility.ParseQueryString(responseBody);
        var accessToken = parameters["access_token"];
        if (string.IsNullOrEmpty(accessToken)) throw new Exception(responseBody);
        return accessToken;        
    }

    private async Task<GithubUserDto> GetGithubUser(string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        client.DefaultRequestHeaders.Add("User-Agent", "App");
        var response = await client.GetAsync("https://api.github.com/user");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<GithubUserDto>(content);
        return userData;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
    {
        try
        {
            await _userService.Create(registerRequest);
            return Ok();
        }
        catch (Exception ex) 
        { 
            return BadRequest(ex.Message);
        }
        
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var tokens = await _authService.Login(loginRequest);

            HttpContext.Response.Cookies.Append("access_token", tokens.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.Strict
            });
            HttpContext.Response.Cookies.Append("refresh_token", tokens.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Strict
            });


            return Ok(new { Token = tokens.AccessToken });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }

    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        string refreshToken = HttpContext.Request.Cookies["refresh_token"] ?? "";
        try
        {
            var tokens = await _authService.RefreshToken(refreshToken);

            HttpContext.Response.Cookies.Append("access_token", tokens.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.Strict
            });
            HttpContext.Response.Cookies.Append("refresh_token", tokens.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Strict
            });


            return Ok("Successful refresh");
        }
        catch (SecurityTokenException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest("Ha ocurrido un error inesperado.");
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        try
        {
            await _authService.Logout(userId);
            return Ok("Logged out successfully");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}

using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Enums;
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

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;    // Id del usuario
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;           // Nombre del usuario
        var email = User.FindFirst(ClaimTypes.Email)?.Value;             // Email del usuario
        var accountStatus = User.FindFirst("accountStatus")?.Value;     // Estado de la cuenta (pendiente, activa, desactivada)
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        return Ok(new
        {
            userId,
            userName,
            email,
            role,
            accountStatus
        });
    }

    [HttpGet("oauth/{app}")]
    public async Task<IActionResult> OAuth(string app, string code)
    {        
        try
        {          
            string accessToken = await GetGithubToken(code);
            var userData = await GetGithubUser(accessToken);

            var tokens = await _authService.LoginWithGithub(userData);
            if (tokens is null)
            {
                await _userService.Create(userData);
                return Redirect("http://localhost:5173");
            }

            HttpContext.Response.Cookies.Append("access_token", tokens.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.None
            });

            HttpContext.Response.Cookies.Append("refresh_token", tokens.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None
            });
            return Redirect("http://localhost:5173");
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
        var userData = JsonSerializer.Deserialize<GithubUserDto>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }); ;

        var emailResponse = await client.GetAsync("https://api.github.com/user/emails");
        if (!emailResponse.IsSuccessStatusCode)
        {
            Console.WriteLine("Error al obtener los correos electrónicos");
            return userData;  // Devuelve el objeto sin email si falla
        }

        var emailContent = await emailResponse.Content.ReadAsStringAsync();
        var emails = JsonSerializer.Deserialize<List<GithubEmailDto>>(emailContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        Console.WriteLine(emailContent);
        if (emails != null)
        {
            // Buscar el correo principal verificado
            var primaryEmail = emails.FirstOrDefault(e => e.Primary && e.Verified)?.Email;
            if (!string.IsNullOrEmpty(primaryEmail))
            {
                userData.Email = primaryEmail;
            }
        }

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
                SameSite = SameSiteMode.None
            });
            HttpContext.Response.Cookies.Append("refresh_token", tokens.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None
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
        string refreshToken = HttpContext.Request.Cookies["refresh_token"] ?? throw new SecurityTokenException("refresh token not found");
        try
        {
            var tokens = await _authService.RefreshToken(refreshToken);

            HttpContext.Response.Cookies.Append("access_token", tokens.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.None
            });
            HttpContext.Response.Cookies.Append("refresh_token", tokens.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None
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


    [Authorize]
    [HttpPut("complete-account")]
    public async Task<IActionResult> CompleteAccount([FromBody] CompleteAccountRequest completeAccountRequest)
    {
        try
        {
            string userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new NotFoundException("user not found");
            int userId = int.Parse(userIdClaim);
            await _userService.CompleteAccount(completeAccountRequest, userId);
            string accessToken = await _authService.UpdateAccessTokenById(userId);

            HttpContext.Response.Cookies.Append("access_token", accessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.None
            });

            return NoContent();
        }
        catch(Exception ex) 
        {
            return BadRequest(new { Error = ex.Message});
        }
    }
}

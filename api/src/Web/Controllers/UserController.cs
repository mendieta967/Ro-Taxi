using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Security.Claims;

namespace Web.Controllers;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetAll()
    {
        return Ok(await _userService.GetAll());
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        string userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        int idFromToken = int.Parse(userIdClaim!);
        bool isAdmin = User.IsInRole(UserRole.Admin.ToString());
        if (idFromToken != id && !isAdmin)
        {
            return Unauthorized("You are not authorized to view this user's data");
        }

        try
        {
            var user = await _userService.GetById(id);
            return Ok(user);
        }
        catch (NotFoundException ex) 
        { 
            return NotFound(new {Error = ex.Message});
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpPatch("change-password")]  // Ruta sin barra
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest) 
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _userService.ChangePassword(changePasswordRequest, userId);
            return NoContent();
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

}

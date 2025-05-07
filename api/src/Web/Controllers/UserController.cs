using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<User>> GetAll()
    {
        return Ok(await _userService.GetAll());
    }

    [Authorize]
    [HttpGet("test")]
    public IActionResult TestAuth()
    {
        return Ok("Nice test!");
    }
}

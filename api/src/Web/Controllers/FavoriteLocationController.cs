using Application.Interfaces;
using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Web.Controllers;

[Route("api/favorite-location")]
[ApiController]
public class FavoriteLocationController : ControllerBase
{
    private readonly IFavoriteLocationService _favoriteLocationService;
    public FavoriteLocationController(IFavoriteLocationService favoriteLocationService)
    {
        _favoriteLocationService = favoriteLocationService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var locations = await _favoriteLocationService.GetAll(userId);
            return Ok(locations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<FavoriteLocationDto>> Create([FromBody] FavoriteLocationRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var location = await _favoriteLocationService.Create(request, userId);
            return Created("", location);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{locationId}")]
    public async Task<IActionResult> Update([FromBody] FavoriteLocationRequest request, int locationId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _favoriteLocationService.Update(request, userId, locationId);
            return NoContent();
        }
        catch (ForbiddenAccessException ex)
        {
            return StatusCode(403, new { Error = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{locationId}")]
    public async Task<ActionResult<UserDto>> Delete(int locationId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _favoriteLocationService.Delete(userId, locationId);
            return NoContent();
        }
        catch (ForbiddenAccessException ex)
        {
            return StatusCode(403, new { Error = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }
}

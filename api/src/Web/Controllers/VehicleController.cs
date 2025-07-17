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

[Route("api/vehicle")]
[ApiController]
public class VehicleController : ControllerBase
{
    private readonly IVehicleService _vehicleService;
    public VehicleController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<Task<List<Ride>>>> GetAll(
            [FromQuery] PaginationParams pagination,
            [FromQuery] RideFilterParams filter)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var vehicles = await _vehicleService.GetAll(userId, pagination);
            return Ok(vehicles);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Ride>> Create([FromBody] VehicleCreateRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        try
        {
            var ride = await _vehicleService.Create(userId, request);
            return Created("", ride);
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

    [Authorize]
    [HttpPut("{vehicleId}")]
    public async Task<ActionResult<UserDto>> Update([FromBody] VehicleUpdateRequest updateRequest, int vehicleId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            VehicleDto vehicle = await _vehicleService.Update(updateRequest, userId, vehicleId);
            return Ok(vehicle);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (ForbiddenAccessException ex)
        {
            return StatusCode(403, new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{vehicleId}")]
    public async Task<ActionResult<UserDto>> Delete(int vehicleId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _vehicleService.Delete(userId, vehicleId);
            return NoContent(); 
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (ForbiddenAccessException ex)
        {
            return StatusCode(403, new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}

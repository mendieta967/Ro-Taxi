using Application.Interfaces;
using Application.Models.Parameters;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Web.Controllers;

[Route("api/chat")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IRideService _rideService;
    public ChatController(IMessageService messageService, IRideService rideService)
    {
        _messageService = messageService;
        _rideService = rideService;
    }

    [Authorize(Roles = nameof(UserRole.Driver))]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var rides = await _rideService.GetWithMessages(userId, pagination);
            return Ok(rides);
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
    [HttpGet("{rideId}")]
    public async Task<IActionResult> GetById(int rideId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var chat = await _messageService.GetChat(rideId, userId);
            return Ok(chat);
        }
        catch (ForbiddenAccessException ex)
        {
            return StatusCode(403, new { Error = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new {Error = ex.Message});
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    [Authorize]
    [HttpPatch("{rideId}/mark-as-seen")]
    public async Task<IActionResult> MarkLastMessageAsSeen(int rideId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        try 
        {
            await _messageService.MarkAsSeen(userId, rideId);
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

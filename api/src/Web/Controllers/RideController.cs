using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [Route("api/ride")]
    [ApiController]
    public class RideController : ControllerBase
    {
        private readonly IRideService _rideService;

        public RideController(IRideService rideService)
        {
            _rideService = rideService;
        }


        [Authorize]
        [HttpGet]
        public async Task<ActionResult<Task<List<Ride>>>> GetAll()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var rides = await _rideService.GetAll(userId);
                return Ok(rides);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Ride>> Create([FromBody] RideCreateRequest request)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var ride = await _rideService.CreateScheduleRide(userId, request);
                return Created("",ride);
            } 
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new {Error =  ex.Message});
            }
        }

        [Authorize]
        [HttpPut("{rideId}")]
        public async Task<IActionResult> Update([FromRoute] int rideId, [FromBody] RideCreateRequest rideCreateRequest)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _rideService.Update(userId, rideId, rideCreateRequest);
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


        [Authorize]
        [HttpDelete("{rideId}")]
        public async Task<IActionResult> Cancel([FromRoute] int rideId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _rideService.Cancel(userId, rideId);
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
}

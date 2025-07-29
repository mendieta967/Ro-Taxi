using Application.Interfaces;
using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.Hubs;

namespace Web.Controllers
{
    [Route("api/ride")]
    [ApiController]
    public class RideController : ControllerBase
    {
        private readonly IRideService _rideService;
        private readonly IHubContext<RideHub> _hubContext;

        public RideController(IRideService rideService, IHubContext<RideHub> hubContext)
        {
            _rideService = rideService;
            _hubContext = hubContext;
        }


        [Authorize]
        [HttpGet]
        public async Task<ActionResult<Task<List<RideDto>>>> GetAll(
            [FromQuery] PaginationParams pagination, 
            [FromQuery] RideFilterParams filter)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var rides = await _rideService.GetAll(userId, pagination, filter);
                return Ok(rides);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Driver))]
        [HttpGet("scheduled-for-driver")]
        public async Task<ActionResult<Task<List<RideDto>>>> GetSchedulesForDriver(
            [FromQuery] PaginationParams pagination,
            [FromQuery] GetSchedulesForDriverRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var rides = await _rideService.GetSchedules(userId, pagination, request);
                return Ok(rides);
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

        [Authorize(Roles = nameof(UserRole.Driver))]
        [HttpGet("pending")]
        public async Task<ActionResult<RideDto>> GetPending([FromQuery] double driverLat, [FromQuery] double driverLng)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var ride = await _rideService.GetPending(userId, driverLat, driverLng);
                return Ok(ride);
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
        [HttpPost]
        public async Task<ActionResult<RideDto>> Create([FromBody] RideCreateRequest request)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var ride = await _rideService.Create(userId, request);    
                return Created($"/api/rides/{ride.Id}", ride);
            } 
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new {Error =  ex.Message});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("{rideId}")]
        public async Task<IActionResult> Update([FromRoute] int rideId, [FromBody] RideUpdateRequest rideUpdateRequest)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _rideService.Update(userId, rideId, rideUpdateRequest);
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

        [Authorize(Roles = nameof(UserRole.Driver))]
        [HttpPost("{rideId}/reject")]
        public async Task<IActionResult> Reject(int rideId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                await _rideService.Reject(userId, rideId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Driver))]
        [HttpPost("{rideId}/accept")]
        public async Task<IActionResult> Accept(int rideId, [FromBody] RideAcceptRequest request)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var ride = await _rideService.Accept(userId, rideId, request);
                await _hubContext.Clients.User(ride.Passeger.Id.ToString()).SendAsync("RideAccepted", ride);
                return NoContent(); 
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }


        [Authorize]
        [HttpDelete("{rideId}/cancel")]
        public async Task<IActionResult> Cancel([FromRoute] int rideId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userRole = User.FindFirst(ClaimTypes.Role)!.Value;
            try
            {
                var ride = await _rideService.Cancel(userId, rideId);
                if (userRole == UserRole.Driver.ToString())
                {
                    await _hubContext.Clients.User(ride.PassegerId.ToString()).SendAsync("RideCanceled", rideId);
                }
                else
                {
                    await _hubContext.Clients.User(ride.DriverId.ToString()).SendAsync("RideCanceled", rideId);
                }
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

        [Authorize(Roles = nameof(UserRole.Driver))]
        [HttpPost("{rideId}/complete")]
        public async Task<IActionResult> CompleteRide(int rideId)
        {
            int driverId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var ride = await _rideService.Complete(driverId, rideId);
                await _hubContext.Clients.User(ride.PassegerId.ToString()).SendAsync("RideCompleted", rideId);
                return NoContent(); 
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [Authorize(Roles = nameof(UserRole.Client))]
        [HttpPost("{rideId}/rate")]
        public async Task<IActionResult> RateRide(int rideId, [FromBody] int rating)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                await _rideService.RateRide(userId, rideId, rating);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost("calculate-price")]
        public ActionResult<decimal> CalculatePrice([FromBody] CalculatePriceRequest calculatePriceRequest)
        {
            return Ok(new { EstimatedPrice = _rideService.CalculatePrice(calculatePriceRequest) });
        }

    }
}

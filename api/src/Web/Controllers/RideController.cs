using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            var roleString = User.FindFirst(ClaimTypes.Role)!.Value;

            if (!Enum.TryParse<UserRole>(roleString, ignoreCase: true, out var role))
            {
                return BadRequest(new { Error = "Invalid user role." });
            }

            try
            {
                var rides = await _rideService.GetAll(role, userId);
                return Ok(rides);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RideCreateRequest request)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var ride = await _rideService.CreateScheduleRide(userId, request);
                return Ok(ride);
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
    }
}

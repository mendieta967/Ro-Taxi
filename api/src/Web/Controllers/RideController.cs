using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RideController : ControllerBase
    {
        private readonly IRideService _rideService;

        public RideController(IRideService rideService)
        {
            _rideService = rideService;
        }


        [Authorize]
        [HttpGet("rides")]
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
    }
}

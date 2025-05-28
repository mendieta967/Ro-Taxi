using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services;

public class RideService: IRideService
{
    private readonly IRideRepository _rideRepository;

    public RideService(IRideRepository rideRepository)
    {
        _rideRepository = rideRepository;
    }
    public async Task<List<Ride>> GetAll(UserRole role, int userId)
    {   
        if (role == UserRole.Client)
        {
            return await _rideRepository.GetAllByPasseger(userId);
        }
        else if (role == UserRole.Driver) 
        { 
            return await _rideRepository.GetAllByDriver(userId);
        }

        return await _rideRepository.GetAll();
    }
}

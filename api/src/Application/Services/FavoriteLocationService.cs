using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Application.Services;

public class FavoriteLocationService: IFavoriteLocationService
{
    private readonly IFavoriteLocationRepository _favoriteLocationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    public FavoriteLocationService(IFavoriteLocationRepository favoriteLocationRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _favoriteLocationRepository = favoriteLocationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<FavoriteLocationDto>> GetAll(int userId)
    {
        var locations = await _favoriteLocationRepository.GetAll(userId);
        return locations.Select(l => new FavoriteLocationDto(l)).ToList();
    }
    
    public async Task<FavoriteLocationDto> Create(FavoriteLocationRequest request, int userId)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");

        var location = new FavoriteLocation()
        {
            Address = request.Address,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
        };

        await _favoriteLocationRepository.Create(location);
        await _unitOfWork.SaveChangesAsync();
        return new FavoriteLocationDto(location);
    }
    public async Task Update(FavoriteLocationRequest request, int userId, int locationId)
    {
        var location = await _favoriteLocationRepository.GetById(locationId) ?? throw new NotFoundException("location not found");

        if (location.UserId != userId) throw new ForbiddenAccessException("You do not have access to this location.");

        location.Address = request.Address;
        location.Latitude = request.Latitude;
        location.Longitude = request.Longitude;
        location.Name = request.Name;

        _favoriteLocationRepository.Update(location);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task Delete(int userId, int locationId)
    {
        var location = await _favoriteLocationRepository.GetById(locationId) ?? throw new NotFoundException("location not found");

        if (location.UserId != userId) throw new ForbiddenAccessException("You do not have access to this location.");

        _favoriteLocationRepository.Delete(location);
        await _unitOfWork.SaveChangesAsync();
    }
}

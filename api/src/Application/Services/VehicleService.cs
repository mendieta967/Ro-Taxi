using Application.Models.Parameters;
using Application.Models;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Models.Requests;

namespace Application.Services;

public class VehicleService: IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    public VehicleService(IVehicleRepository vehicleRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _vehicleRepository = vehicleRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<PaginatedList<VehicleDto>> GetAll(int userId, PaginationParams pagination)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");
        var response = user.Role == UserRole.Admin
            ? await _vehicleRepository.GetAll(null, pagination.Page, pagination.PageSize)
            : await _vehicleRepository.GetAll(userId, pagination.Page, pagination.PageSize);

        var data = response.Data.Select(vehicle => new VehicleDto(vehicle)).ToList();
        return new PaginatedList<VehicleDto>(data, response.TotalData, response.PageNumber, response.PageSize, response.TotalPages);
    }

    public async Task<Vehicle> Create(int userId, VehicleCreateRequest request)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");        
        
        var vehicle = new Vehicle
        {
            Model = request.Model,
            Year = request.Year,
            Brand = request.Brand,
            LicensePlate = request.LicensePlate,
            Color = request.Color,
            DriverId = userId,
            CreatedAt = DateTime.UtcNow,
        };

        if (user.Role != UserRole.Admin)
        {
            vehicle.DriverId = userId;
        }        

        await _vehicleRepository.Create(vehicle);
        await _unitOfWork.SaveChangesAsync();

        return vehicle;
    }
}

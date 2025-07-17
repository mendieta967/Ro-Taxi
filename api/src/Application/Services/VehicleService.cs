using Application.Interfaces;
using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

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
    public async Task<PaginatedList<VehicleDto>> GetAll(int userId, PaginationParams pagination, VehicleFilterParams filter)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");
        var response = user.Role == UserRole.Admin
            ? await _vehicleRepository.GetAll(null, pagination.Page, pagination.PageSize, filter.LicensePlate)
            : await _vehicleRepository.GetAll(userId, pagination.Page, pagination.PageSize, filter.LicensePlate);

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
            Status = request.Status,
        };

        if (user.Role != UserRole.Admin)
        {
            vehicle.DriverId = userId;
        }        

        await _vehicleRepository.Create(vehicle);
        await _unitOfWork.SaveChangesAsync();

        return vehicle;
    }

    public async Task<VehicleDto> Update(VehicleUpdateRequest request, int userId, int vehicleId)
    {
        var vehicle = await _vehicleRepository.GetById(vehicleId) ?? throw new NotFoundException("vehicle not found"); 
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");

        if (user.Id != vehicle.DriverId && user.Role != UserRole.Admin)
            throw new ForbiddenAccessException("You do not have access to this vehicle.");

        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.Brand = request.Brand;
        vehicle.LicensePlate = request.LicensePlate;
        vehicle.Color = request.Color;
        vehicle.Status = request.Status;

        _vehicleRepository.Update(vehicle);
        await _unitOfWork.SaveChangesAsync();
        return new VehicleDto(vehicle);
    }

    public async Task Delete(int userId, int vehicleId)
    {
        var vehicle = await _vehicleRepository.GetById(vehicleId) ?? throw new NotFoundException("vehicle not found");
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");

        if (user.Id != vehicle.DriverId && user.Role != UserRole.Admin)
            throw new ForbiddenAccessException("You do not have access to this vehicle.");

        vehicle.Status = VehicleStatus.Deleted;

        _vehicleRepository.Update(vehicle);
        await _unitOfWork.SaveChangesAsync();        
    }
}

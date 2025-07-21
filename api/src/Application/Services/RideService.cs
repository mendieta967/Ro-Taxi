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
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services;

public class RideService : IRideService
{
    private readonly IRideRepository _rideRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IPaymentMethodRepository _paymentMethodRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RideService(IRideRepository rideRepository, IUserRepository userRepository, IUnitOfWork unitOfWork, IPaymentRepository paymentRepository, IPaymentMethodRepository paymentMethodRepository)
    {
        _rideRepository = rideRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _paymentRepository = paymentRepository;
        _paymentMethodRepository = paymentMethodRepository;
    }
    
    public async Task<PaginatedList<RideDto>> GetAll(int userId, PaginationParams pagination, RideFilterParams filter)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");

        RideStatus? status = null;
        if (!string.IsNullOrEmpty(filter.Status))
        {
            if (!Enum.TryParse<RideStatus>(filter.Status, true, out var parsedStatus))
                throw new Exception("Invalid role filter.");
            status = parsedStatus;
        }

        var response = user.Role == UserRole.Admin 
            ? await _rideRepository.GetAll(null, pagination.Page, pagination.PageSize, status, filter.Search, filter.Date)
            : await _rideRepository.GetAll(userId, pagination.Page, pagination.PageSize, status, filter.Search, filter.Date);
        var data = response.Data.Select(ride => new RideDto(ride)).ToList();


        return new PaginatedList<RideDto>(data, response.TotalData, response.PageNumber, response.PageSize, response.TotalPages);
    }

    public async Task<PaginatedList<RideDto>> GetSchedulesForDriver(int userId, PaginationParams pagination, GetSchedulesForDriverRequest request)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");

        var response = await _rideRepository.GetSchedulesForDriver(pagination.Page, pagination.PageSize, request.DriverLat, request.DriverLng);
        var data = response.Data.Select(ride => new RideDto(ride)).ToList();
        return new PaginatedList<RideDto>(data, response.TotalData, response.PageNumber, response.PageSize, response.TotalPages);
    }

    public async Task<RideDto> CreateScheduleRide(int userId, RideCreateRequest request)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");

        var calculatedPrice = CalculatePrice(new CalculatePriceRequest { OriginLat = request.OriginLat, OriginLng = request.OriginLng, DestLat = request.DestinationLat, DestLng = request.DestinationLng });
        if (Math.Abs(calculatedPrice - request.CalculatedPrice) > 0.01m)
            throw new BadRequestException("error calculated price");

        var now = DateTime.UtcNow;

        if (request.ScheduledAt.HasValue && request.ScheduledAt.Value <= now)
            throw new BadRequestException("The scheduled date and time must be in the future.");

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // ride
            var ride = new Ride
            {
                PassegerId = userId,
                OriginAddress = request.OriginAddress,
                OriginLat = request.OriginLat,
                OriginLng = request.OriginLng,
                DestinationAddress = request.DestinationAddress,
                DestinationLat = request.DestinationLat,
                DestinationLng = request.DestinationLng,               
                RequestedAt = now,
                ScheduledAt = request.ScheduledAt
            };
            await _rideRepository.Create(ride);

            // payment
            var payment = new Payment
            {
                Ride = ride,
                Amount = calculatedPrice,
                CreatedAt = now
            };
            if (request.PaymentMethodId is not null)
            {
                var paymentMethod = await _paymentMethodRepository.GetById(userId, request.PaymentMethodId.Value);
                if (paymentMethod is null) throw new NotFoundException("payment method not found");
                payment.PaymentMethodId = request.PaymentMethodId;
            }
            await _paymentRepository.Create(payment);

            // save
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();
            ride.Payment = payment;
            return new RideDto(ride);
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }
    public async Task Update(int userId, int rideId, RideUpdateRequest request)
    {

        var ride = await _rideRepository.GetById(rideId);

        if (ride is null) throw new NotFoundException("Ride not found");
        if (ride.Status != RideStatus.Pending) throw new Exception("This ride cannot be editing");
        if (ride.PassegerId != userId) throw new ForbiddenAccessException("You do not have access to this ride.");
        if (request.ScheduledAt.HasValue && request.ScheduledAt.Value <= DateTime.UtcNow)
            throw new BadRequestException("The scheduled date and time must be in the future.");

        if (request.ScheduledAt is not null) ride.ScheduledAt = request.ScheduledAt;        

        _rideRepository.Update(ride);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task Accept(int userId, int rideId)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        var ride = await _rideRepository.GetById(rideId) ?? throw new NotFoundException("Ride not found");
        if (ride.Status != RideStatus.Pending || ride.DriverId != null) throw new InvalidOperationException("This ride cannot be accepted");

        ride.DriverId = userId;
        ride.Status = RideStatus.InProgress;
        ride.StartedAt = DateTime.UtcNow;

        _rideRepository.Update(ride);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task Cancel(int userId, int rideId)
    {
        var ride = await _rideRepository.GetById(rideId);
        if (ride is null) throw new NotFoundException("Ride not found");
        if (ride.Status != RideStatus.Pending && ride.Status != RideStatus.InProgress)
            throw new Exception("This ride cannot be cancel");

        if (ride.Status == RideStatus.Pending)
        {
            if (ride.PassegerId != userId) throw new ForbiddenAccessException("You do not have access to this ride.");
            _rideRepository.Delete(ride);
        }
        else
        {
            if (ride.PassegerId != userId && ride.DriverId != userId)
                throw new ForbiddenAccessException("You do not have access to this ride.");

            ride.Status = RideStatus.Cancelled;
            _rideRepository.Update(ride);
        }

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task Complete(int userId, int rideId)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        var ride = await _rideRepository.GetById(rideId) ?? throw new NotFoundException("Ride not found");

        if (ride.DriverId != userId)
            throw new UnauthorizedAccessException("This driver is not assigned to this ride");

        if (ride.Status != RideStatus.InProgress)
            throw new InvalidOperationException("Only rides in progress can be completed");

        ride.Status = RideStatus.Completed;
        ride.EndedAt = DateTime.UtcNow;

        _rideRepository.Update(ride);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RateRide(int userId, int rideId, int rating)
    {
        var user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        var ride = await _rideRepository.GetById(rideId) ?? throw new NotFoundException("Ride not found");

        if (ride.PassegerId != userId)
            throw new UnauthorizedAccessException("This passenger is not associated with the ride");

        if (ride.Status != RideStatus.Completed)
            throw new InvalidOperationException("You can only rate completed rides");

        if (rating < 1 || rating > 5)
            throw new ArgumentException("Rating must be between 1 and 5");

        if (ride.Rating != null)
            throw new InvalidOperationException("this ride is already rated");
        
        ride.Rating = rating;

        _rideRepository.Update(ride);
        await _unitOfWork.SaveChangesAsync();
    }

    public decimal CalculatePrice(CalculatePriceRequest request)
    {
        decimal baseFare = 600m;        // Tarifa inicial en BA
        decimal pricePerBlock = 25m;    // Aproximadamente $25 por cuadra
        decimal pricePerMinute = 50m;   // Precio por minuto
        double averageSpeedKmh = 20;    // Velocidad urbana promedio

        double toRad(double deg) => deg * Math.PI / 180;

        double R = 6371;
        double dLat = toRad(request.DestLat - request.OriginLat);
        double dLon = toRad(request.DestLng - request.OriginLng);
        double lat1 = toRad(request.OriginLat), lat2 = toRad(request.DestLat);
        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(lat1) * Math.Cos(lat2) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        double distanceKm = R * c;

        int blocks = (int)Math.Ceiling(distanceKm / 0.1);
        double estimatedTimeHours = distanceKm / averageSpeedKmh;
        decimal estimatedTimeMinutes = (decimal)(estimatedTimeHours * 60);

        decimal price = baseFare + (blocks * pricePerBlock) + (estimatedTimeMinutes * pricePerMinute);
        return Math.Round(price, 2);
    }


}

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
    
    public async Task<PaginatedList<Ride>> GetAll(int userId, PaginationParams pagination, RideFilterParams filter)
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

        if (user.Role == UserRole.Admin)
        {
            return await _rideRepository.GetAll(null, pagination.Page, pagination.PageSize, status, filter.Search);
        }

        return await _rideRepository.GetAll(userId, pagination.Page, pagination.PageSize, status, filter.Search);
    }
    public async Task<Ride> CreateScheduleRide(int userId, RideCreateRequest request)
    {
        var user = _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");
        var now = DateTime.UtcNow;

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
                EstimatedPrice = CalculatePrice(new CalculatePriceRequest { OriginLat = request.OriginLat, OriginLng = request.OriginLng, DestLat = request.DestinationLat, DestLng = request.DestinationLng }),
                RequestedAt = now,
                ScheduledAt = request.ScheduledAt
            };
            await _rideRepository.Create(ride);
            await _unitOfWork.SaveChangesAsync();

            // payment
            var payment = new Payment
            {
                RideId = ride.Id,
                Amount = ride.EstimatedPrice,
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
            return ride;
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

        if (request.OriginAddress != null && request.OriginLat != null && request.OriginLng != null && 
            request.DestinationAddress != null && request.DestinationLat != null && request.DestinationLng != null) 
        {
            ride.OriginAddress = request.OriginAddress;
            ride.OriginLat = request.OriginLat.Value;
            ride.OriginLng = request.OriginLng.Value;
            ride.DestinationAddress = request.DestinationAddress;
            ride.DestinationLat = request.DestinationLat.Value;
            ride.DestinationLng = request.DestinationLng.Value;

            ride.EstimatedPrice = CalculatePrice(new CalculatePriceRequest { OriginLat = request.OriginLat.Value, OriginLng = request.OriginLng.Value, DestLat = request.DestinationLat.Value, DestLng = request.DestinationLng.Value });
            var payment = await _paymentRepository.GetByRideId(rideId);
            payment.Amount = ride.EstimatedPrice;
            _paymentRepository.Update(payment);
        }
        
        if(request.ScheduledAt is not null) ride.ScheduledAt = request.ScheduledAt;

        if (request.PaymentMethodId is not null)
        {
            var paymentMethod = await _paymentMethodRepository.GetById(userId, request.PaymentMethodId.Value);
            if (paymentMethod is null) throw new NotFoundException("payment method not found");
            var payment = await _paymentRepository.GetByRideId(rideId);
            payment.PaymentMethodId = request.PaymentMethodId;
            _paymentRepository.Update(payment);
        }

        _rideRepository.Update(ride);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task Cancel(int userId, int rideId)
    {
        var ride = await _rideRepository.GetById(rideId);
        if (ride is null) throw new NotFoundException("Ride not found");
        if (ride.Status != RideStatus.Pending && ride.Status != RideStatus.Accepted)
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
    public decimal CalculatePrice(CalculatePriceRequest request)
    {        
        // Ejemplo simple usando distancia euclideana (NO es exacto, solo placeholder)
        var distance = Math.Sqrt(
            Math.Pow(request.DestLat - request.OriginLat, 2) + Math.Pow(request.DestLng - request.OriginLng, 2)
        );

        // Supongamos $150 por km estimado
        return Math.Round((decimal)(distance * 111 * 150), 2);
    }
}

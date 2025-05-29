using Application.Interfaces;
using Application.Models;
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

public class RideService: IRideService
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
    public async Task<List<Ride>> GetAll(int userId)
    {
        var user = await _userRepository.GetById(userId);
        if(user is null) throw new NotFoundException("user not found");

        if (user.Role == UserRole.Client)
        {
            return await _rideRepository.GetAllByPasseger(userId);
        }
        else if (user.Role == UserRole.Driver) 
        { 
            return await _rideRepository.GetAllByDriver(userId);
        }

        return await _rideRepository.GetAll();
    }

    public async Task<Ride> CreateScheduleRide(int userId, RideCreateRequest request)
    {
        var user = await _userRepository.GetById(userId);
        if (user is null) throw new NotFoundException("user not found");

        var ride = new Ride
        {
            PassegerId = userId,
            OriginAddress = request.OriginAddress,
            OriginLat = request.OriginLat,
            OriginLng = request.OriginLng,
            DestinationAddress = request.DestinationAddress,
            DestinationLat = request.DestinationLat,
            DestinationLng = request.DestinationLng,
            EstimatedPrice = EstimatePrice(request.OriginLat, request.OriginLng, request.DestinationLat, request.DestinationLng),
            RequestedAt = DateTime.UtcNow,
            ScheduledAt = request.ScheduledAt
        };

        await _rideRepository.Create(ride);
        await _unitOfWork.SaveChangesAsync();

        return ride;
    }

    //public async Task<Ride> Create(int userId, RideCreateRequest request)
    //{
    //    var user = _userRepository.GetById(userId);
    //    if(user is null) throw new NotFoundException("user not found");
    //    var now = DateTime.UtcNow;

    //    await _unitOfWork.BeginTransactionAsync();

    //    try
    //    {
    //        // ride
    //        var ride = new Ride
    //        {
    //            PassegerId = userId,
    //            OriginAddress = request.OriginAddress,
    //            OriginLat = request.OriginLat,
    //            OriginLng = request.OriginLng,
    //            DestinationAddress = request.DestinationAddress,
    //            DestinationLat = request.DestinationLat,
    //            DestinationLng = request.DestinationLng,
    //            EstimatedPrice = EstimatePrice(request.OriginLat, request.OriginLng, request.DestinationLat, request.DestinationLng),
    //            RequestedAt = now,
    //            ScheduledAt = request.ScheduledAt
    //        };
    //        await _rideRepository.Create(ride);
    //        await _unitOfWork.SaveChangesAsync();

    //        // payment
    //        var payment = new Payment
    //        {
    //            RideId = ride.Id,
    //            Amount = 0,
    //            CreatedAt = now
    //        };
    //        if (request.PaymentMethodId is not null)
    //        {
    //            var paymentMethod = await _paymentMethodRepository.GetById(userId, request.PaymentMethodId.Value);
    //            if (paymentMethod is null) throw new NotFoundException("payment method not found");
    //            payment.PaymentMethodId = request.PaymentMethodId;
    //        }
    //        await _paymentRepository.Create(payment);
    //        await _unitOfWork.SaveChangesAsync();

    //        //update ride with payment id
    //        ride.PaymentId = payment.Id;
    //        _rideRepository.Update(ride);

    //        await _unitOfWork.SaveChangesAsync();
    //        await _unitOfWork.CommitAsync();
    //        return ride;
    //    }
    //    catch 
    //    {
    //        await _unitOfWork.RollbackAsync();
    //        throw;
    //    }        
    //}

    public async Task Cancel(int userId, int rideId)
    {
        var ride = await _rideRepository.GetById(rideId);
        if (ride is null) throw new NotFoundException("Ride not found");
         

        if (ride.Status != RideStatus.Pending && ride.Status != RideStatus.Accepted)
            throw new Exception("This ride cannot be cancel");

        if(ride.Status == RideStatus.Pending)
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
    private decimal EstimatePrice(double originLat, double originLng, double destLat, double destLng)
    {
        // Ejemplo simple usando distancia euclideana (NO es exacto, solo placeholder)
        var distance = Math.Sqrt(
            Math.Pow(destLat - originLat, 2) + Math.Pow(destLng - originLng, 2)
        );

        // Supongamos $150 por km estimado
        return Math.Round((decimal)(distance * 111 * 150), 2);
    }


}

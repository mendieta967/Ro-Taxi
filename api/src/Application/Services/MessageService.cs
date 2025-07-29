using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services;

public class MessageService: IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IRideRepository _rideRepository;
    private readonly IUnitOfWork _unitOfWork;
    public MessageService(IMessageRepository messageRepository, IUnitOfWork unitOfWork, IRideRepository rideRepository)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _rideRepository = rideRepository;
    }

    public async Task<List<MessageDto>> GetChat(int rideId, int userId)
    {
        var ride = await _rideRepository.GetById(rideId) ?? throw new NotFoundException("Ride not found");

        if (ride.PassegerId != userId && ride.DriverId != userId)
            throw new ForbiddenAccessException("User is not authorized to see messages of this ride");

        var chat = await _messageRepository.GetChat(rideId);
        return chat.Select(m => new MessageDto(m)).ToList();
    }

    public async Task<MessageDto> Create(int userId, int rideId, string text)
    {
        var ride = await _rideRepository.GetById(rideId) ?? throw new Exception("Ride not found");

        if (ride.Status != RideStatus.InProgress) throw new Exception("This ride is not in progress");

        if (ride.PassegerId != userId && ride.DriverId != userId) throw new Exception("User is not authorized for this ride");

        var message = new Message() 
        {
            RideId = rideId,
            UserId = userId,
            Text = text,
            Timestamp = DateTime.UtcNow
        };

        _messageRepository.Create(message);
        await _unitOfWork.SaveChangesAsync();

        var newMessage = await _messageRepository.GetById(message.Id);
        return new MessageDto(newMessage);
    }

    public async Task MarkAsSeen(int userId, int rideId)
    {
        var ride = await _rideRepository.GetById(rideId) ?? throw new NotFoundException("ride not found");

        if (ride.DriverId != userId)
            throw new ForbiddenAccessException("Only the driver of the ride can mark messages as seen");

        await _messageRepository.MarkMessagesAsSeen(rideId, userId);
    }
}

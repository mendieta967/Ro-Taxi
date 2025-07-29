using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class RideWithMessageDto
{
    public int Id { get; set; }
    public string PassengerName { get; set; }
    public int UnreadMessages { get; set; }
    public MessageDto? LastMessage { get; set; }

    public RideWithMessageDto(Ride ride, int userId)
    {
        Id = ride.Id;
        PassengerName = ride.Passeger.Name;
        UnreadMessages = ride.Messages.Count(m => !m.IsSeen && m.UserId != userId);
        LastMessage = ride.Messages
            .OrderByDescending(m => m.Timestamp)
            .Select(m => new MessageDto(m))
            .FirstOrDefault();
    }
}

using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class MessageDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int RideId { get; set; }
    public string UserName { get; set; }
    public string Text { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsSeen { get; set; }

    public MessageDto(Message message)
    {
        Id = message.Id;
        UserId = message.UserId;
        RideId = message.RideId;
        UserName = message.User.Name;
        Text = message.Text;
        Timestamp = message.Timestamp;
        IsSeen = message.IsSeen;
    }
}

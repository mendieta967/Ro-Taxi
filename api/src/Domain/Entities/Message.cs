using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public int RideId { get; set; }
    public Ride Ride { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public string Text { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsSeen { get; set; }
}

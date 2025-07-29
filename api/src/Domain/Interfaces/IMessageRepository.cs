using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IMessageRepository
{
    Task<List<Message>> GetChat(int rideId);
    Task<Message?> GetById(int id);
    void Create(Message message);
    Task MarkMessagesAsSeen(int rideId, int userId);
}

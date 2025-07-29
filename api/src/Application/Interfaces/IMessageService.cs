using Application.Models;
using Application.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IMessageService
{
    Task<List<MessageDto>> GetChat(int rideId, int userId);
    Task<MessageDto> Create(int userId, int rideId, string text);
    Task MarkAsSeen(int userId, int rideId);
}

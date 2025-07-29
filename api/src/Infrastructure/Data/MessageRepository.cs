using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class MessageRepository: IMessageRepository
{
    private readonly ApplicationDbContext _context;
    public MessageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Message>> GetChat(int rideId)
    {
        return await _context.Messages
            .Where(m => m.RideId == rideId)
            .OrderBy(m => m.Timestamp) 
            .ToListAsync();
    }

    public async Task<Message?> GetById(int id)
    {
        return await _context.Messages
            .Include(m => m.User)
            .FirstOrDefaultAsync(m  => m.Id == id);
    }

    public void Create(Message message)
    {
        _context.Messages.Add(message);        
    }

    public async Task MarkMessagesAsSeen(int rideId, int userId)
    {
        await _context.Messages
        .Where(m => m.RideId == rideId && m.UserId != userId && !m.IsSeen)
        .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsSeen, true));
    }
}

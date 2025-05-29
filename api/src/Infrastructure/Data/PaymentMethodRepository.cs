using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class PaymentMethodRepository: IPaymentMethodRepository
{
    private readonly ApplicationDbContext _context;

    public PaymentMethodRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PaymentMethod>> GetAll(int userId)
    {
        return await _context.PaymentMethods.Where(p => p.UserId == userId).ToListAsync();
    }

    public async Task<PaymentMethod?> GetById(int userId, int id)
    {
        return await _context.PaymentMethods.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
    }
}

using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IPaymentMethodRepository
{
    Task<List<PaymentMethod>> GetAll(int userId);
    Task<PaymentMethod?> GetById(int userId, int id);
}

using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IPaymentRepository
{
    Task<List<Payment>> GetAll();
    Task Create(Payment payment);
    void Update(Payment payment);
}

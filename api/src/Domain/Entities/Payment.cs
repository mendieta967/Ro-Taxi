using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public int RideId { get; set; }
    public decimal Amount { get; set; }
    public int? PaymentMethodId { get; set; }
    public PaymentMethod? Method { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

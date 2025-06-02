using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class PaymentMethod
{
    public int Id { get; set; } 
    public int UserId { get; set; }
    public User User { get; set; }
    public PaymentType CardType { get; set; } 
    public string ProviderToken { get; set; }   
    public string Last4Digits { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string? Token { get; set; }
    public DateTime CreatedAt { get; set; }
}

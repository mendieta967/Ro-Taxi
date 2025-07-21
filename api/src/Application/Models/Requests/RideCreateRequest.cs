using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class RideCreateRequest
{    
    public string OriginAddress { get; set; }
    public double OriginLat { get; set; }
    public double OriginLng { get; set; }
    public string DestinationAddress { get; set; }
    public double DestinationLat { get; set; }
    public double DestinationLng { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public int? PaymentMethodId { get; set; }
    public decimal CalculatedPrice { get; set; }
}

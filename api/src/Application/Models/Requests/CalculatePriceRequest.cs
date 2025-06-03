using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class CalculatePriceRequest
{
    public double OriginLat {  get; set; }
    public double OriginLng { get; set; }
    public double DestLat { get; set; }
    public double DestLng { get; set; }
}

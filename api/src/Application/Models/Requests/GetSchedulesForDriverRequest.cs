using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class GetSchedulesForDriverRequest
{
    public double DriverLat {  get; set; }
    public double DriverLng { get; set; }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class RideRejection
{
    public int Id { get; set; }
    public int RideId { get; set; }
    public int DriverId { get; set; }
    public DateTime RejectedAt { get; set; }
}

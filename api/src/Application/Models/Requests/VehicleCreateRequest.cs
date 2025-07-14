using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class VehicleCreateRequest
{
    public string LicensePlate { get; set; }
    public string Model { get; set; }
    public string Brand { get; set; }
    public string Color { get; set; }
    public string Year { get; set; }
}

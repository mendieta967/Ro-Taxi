﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class RideUpdateRequest
{
    public DateTime? ScheduledAt { get; set; }
}

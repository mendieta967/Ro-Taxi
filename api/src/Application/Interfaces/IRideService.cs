﻿using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IRideService
{
    public Task<List<Ride>> GetAll(UserRole role, int userId);
}

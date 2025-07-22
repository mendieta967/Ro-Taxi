using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data;

public class RideRejectionRepository: IRideRejectionRepository
{
    private readonly ApplicationDbContext _context;

    public RideRejectionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Create(RideRejection rideRejection)
    {
       _context.RideRejections.Add(rideRejection);
    }
}

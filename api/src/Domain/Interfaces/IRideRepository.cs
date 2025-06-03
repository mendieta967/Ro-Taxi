using Application.Models;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IRideRepository
{
    public Task<PaginatedList<Ride>> GetAll(int? userId, int pageIndex, int pageSize, RideStatus? status, string? search, DateOnly? date);
    Task<Ride?> GetById(int rideId);
    public Task Create(Ride ride);
    void Update(Ride ride);
    void Delete(Ride ride);


}

using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IRideRepository
{
    public Task<List<Ride>> GetAll();
    public Task<List<Ride>> GetAllByPasseger(int id);
    public Task<List<Ride>> GetAllByDriver(int id);
    Task<Ride?> GetById(int rideId);
    public Task Create(Ride ride);
    void Update(Ride ride);
    void Delete(Ride ride);


}

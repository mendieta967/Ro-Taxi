using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface IFavoriteLocationRepository
{
    Task<List<FavoriteLocation>> GetAll(int userId);
    Task<FavoriteLocation?> GetById(int id);
    Task<FavoriteLocation> Create(FavoriteLocation location);
    void Update(FavoriteLocation location);
    void Delete(FavoriteLocation location);
    
}

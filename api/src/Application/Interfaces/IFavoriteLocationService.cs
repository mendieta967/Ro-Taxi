using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IFavoriteLocationService
{
    Task<List<FavoriteLocationDto>> GetAll(int userId);
    Task<FavoriteLocationDto> Create(FavoriteLocationRequest request, int userId);
    Task Update(FavoriteLocationRequest request, int userId, int locationId);
    Task Delete(int userId, int locationId);    
}

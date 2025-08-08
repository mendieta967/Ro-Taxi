using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Dni { get; set; }
    public string Genre { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string AccountStatus { get; set; }
    public double AverageRating { get; set; }
    public int RatingsCount { get; set; }
    public bool IsDeletionScheduled { get; set; }
    public DateTime? DeletionScheduledAt { get; set; }

    public UserDto(User user)
    {
        Id = user.Id;
        Name = user.Name;
        Email = user.Email;
        Dni = user.Dni;
        Genre = user.Genre.ToString() ?? "";
        Role = user.Role.ToString() ?? "";
        CreatedAt = user.CreatedAt;
        UpdatedAt = user.UpdatedAt;
        AccountStatus = user.AccountStatus.ToString() ?? "";
        AverageRating = user.AverageRating;
        RatingsCount = user.RatingsCount;
        IsDeletionScheduled = user.IsDeletionScheduled;
        DeletionScheduledAt = user.DeletionScheduledAt;
    }
}

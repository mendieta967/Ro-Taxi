using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
    public string? Dni {  get; set; }
    public Genre? Genre { get; set; }
    public UserRole? Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public AuthProvider AuthProvider { get; set; }
    public long? GithubId { get; set; }
    public AccountStatus AccountStatus { get; set; }

}

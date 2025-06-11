using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class UserUpdateRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Dni {  get; set; }
    public Genre Genre { get; set; }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class ResendVerificationEmailRequest
{
    public string Email { get; set; }
}

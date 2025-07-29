using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests;

public class MessageCreateRequest
{
    public int RideId { get; set; }
    public string Text { get; set; }
}

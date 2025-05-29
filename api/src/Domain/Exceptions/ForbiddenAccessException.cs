using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions;

public class ForbiddenAccessException: Exception
{
    public ForbiddenAccessException()
    : base()
    {
    }

    public ForbiddenAccessException(string message)
        : base(message)
    {
    }

    public ForbiddenAccessException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

    public ForbiddenAccessException(string name, object key)
        : base($"Entity {name} ({key}) was not found.")
    {
    }
}

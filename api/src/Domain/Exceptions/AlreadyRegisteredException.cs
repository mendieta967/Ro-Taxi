using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions;

public class AlreadyRegisteredException : Exception
{
    public AlreadyRegisteredException()
    : base()
    {
    }

    public AlreadyRegisteredException(string message)
        : base(message)
    {
    }

    public AlreadyRegisteredException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

    public AlreadyRegisteredException(string name, object key)
        : base($"Entity {name} ({key}) was not found.")
    {
    }

}

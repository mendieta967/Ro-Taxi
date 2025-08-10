using Application.Models.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class CompleteAccountRequestValidator: AbstractValidator<CompleteAccountRequest>
{
    public CompleteAccountRequestValidator()
    {
        RuleFor(x => x.Dni).ValidDni();
        RuleFor(x => x.Genre).ValidGenre();
        RuleFor(x => x.Role).ValidRole();
    }
}

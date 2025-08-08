using Application.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class RegisterRequestValidator: AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {

        RuleFor(x => x.Name).ValidName();

        RuleFor(x => x.Email).ValidEmail();

        RuleFor(x => x.Password).ValidPassword();

        RuleFor(x => x.Dni).ValidDni();

        RuleFor(x => x.Genre).ValidGenre();

        RuleFor(x => x.Role).ValidRole();
    }
}

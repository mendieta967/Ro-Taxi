using Application.Models.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class UserUpdateRequestValidator: AbstractValidator<UserUpdateRequest>
{
    public UserUpdateRequestValidator()
    {
        RuleFor(x => x.Email).ValidEmail();
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.Dni).ValidDni();
        RuleFor(x => x.Genre).ValidGenre();
    }
}

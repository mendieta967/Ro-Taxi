using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public static class CustomValidators
{
    public static IRuleBuilderOptions<T, string> ValidEmail<T>(this IRuleBuilder<T, string> rule)
    {
        return rule
            .NotEmpty().WithMessage("El email es obligatorio.")
            .EmailAddress().WithMessage("El email no es válido.");
    }

    public static IRuleBuilderOptions<T, string> ValidPassword<T>(this IRuleBuilder<T, string> rule)
    {
        return rule
            .NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.");
    }

    public static IRuleBuilderOptions<T, string> ValidName<T>(this IRuleBuilder<T, string> rule)
    {
        return rule
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(100).WithMessage("El nombre no puede tener más de 100 caracteres.");
    }

    public static IRuleBuilderOptions<T, string> ValidDni<T>(this IRuleBuilder<T, string> rule)
    {
        return rule
            .NotEmpty().WithMessage("El DNI es obligatorio.")
            .Matches(@"^\d{7,8}$").WithMessage("El DNI debe tener entre 7 y 8 dígitos numéricos.");
    }

    public static IRuleBuilderOptions<T, TEnum> ValidGenre<T, TEnum>(this IRuleBuilder<T, TEnum> rule)
        where TEnum : struct, Enum
    {
        return rule           
            .IsInEnum().WithMessage("El género es inválido.");            
    }

    public static IRuleBuilderOptions<T, TEnum> ValidRole<T, TEnum>(this IRuleBuilder<T, TEnum> rule)
        where TEnum : struct, Enum
    {
        return rule
            .IsInEnum().WithMessage("El rol de usuario es inválido.");
    }
}

using Application.Models.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class VehicleUpdateRequestValidator: AbstractValidator<VehicleUpdateRequest>
{
    public VehicleUpdateRequestValidator()
    {
        RuleFor(x => x.LicensePlate)
            .NotEmpty().WithMessage("La patente es obligatoria.")
            .Length(5, 10).WithMessage("La patente debe tener entre 5 y 10 caracteres.");

        RuleFor(x => x.Model)
            .NotEmpty().WithMessage("El modelo es obligatorio.")
            .MaximumLength(50).WithMessage("El modelo no puede tener más de 50 caracteres.");

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("La marca es obligatoria.")
            .MaximumLength(50).WithMessage("La marca no puede tener más de 50 caracteres.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("El color es obligatorio.")
            .MaximumLength(30).WithMessage("El color no puede tener más de 30 caracteres.");

        RuleFor(x => x.Year)
            .NotEmpty().WithMessage("El año es obligatorio.")
            .Must(BeAValidYear).WithMessage("El año debe ser un número válido entre 1900 y el año actual.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("El estado del vehículo es inválido.");
    }

    private bool BeAValidYear(string year)
    {
        if (!int.TryParse(year, out int parsedYear))
            return false;

        var currentYear = DateTime.UtcNow.Year;
        return parsedYear >= 1900 && parsedYear <= currentYear;
    }

}

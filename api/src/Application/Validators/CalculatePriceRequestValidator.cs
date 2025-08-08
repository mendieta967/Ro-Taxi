using Application.Models.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class CalculatePriceRequestValidator: AbstractValidator<CalculatePriceRequest>
{
    public CalculatePriceRequestValidator()
    {
        RuleFor(x => x.OriginLat)
            .InclusiveBetween(-90, 90)
            .WithMessage("La latitud de origen debe estar entre -90 y 90.");

        RuleFor(x => x.OriginLng)
            .InclusiveBetween(-180, 180)
            .WithMessage("La longitud de origen debe estar entre -180 y 180.");

        RuleFor(x => x.DestLat)
            .InclusiveBetween(-90, 90)
            .WithMessage("La latitud de destino debe estar entre -90 y 90.");

        RuleFor(x => x.DestLng)
            .InclusiveBetween(-180, 180)
            .WithMessage("La longitud de destino debe estar entre -180 y 180.");
    }
}

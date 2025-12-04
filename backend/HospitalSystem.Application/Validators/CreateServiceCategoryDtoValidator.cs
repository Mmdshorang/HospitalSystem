using FluentValidation;
using HospitalSystem.Application.DTOs;

namespace HospitalSystem.Application.Validators;

public class CreateServiceCategoryDtoValidator : AbstractValidator<CreateServiceCategoryDto>
{
    public CreateServiceCategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("نام دسته‌بندی الزامی است")
            .MaximumLength(100).WithMessage("نام دسته‌بندی نمی‌تواند بیشتر از 100 کاراکتر باشد");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));
    }
}


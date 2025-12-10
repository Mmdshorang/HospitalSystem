using FluentValidation;
using HospitalSystem.Application.DTOs;

namespace HospitalSystem.Application.Validators;

public class CreatePatientDtoValidator : AbstractValidator<CreatePatientDto>
{
    public CreatePatientDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("نام الزامی است")
            .MaximumLength(100).WithMessage("طول نام حداکثر ۱۰۰ کاراکتر است");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("نام خانوادگی الزامی است")
            .MaximumLength(100).WithMessage("طول نام خانوادگی حداکثر ۱۰۰ کاراکتر است");

        RuleFor(x => x.NationalCode)
            .NotEmpty().WithMessage("کد ملی الزامی است")
            .MaximumLength(20).WithMessage("طول کد ملی حداکثر ۲۰ کاراکتر است");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("شماره موبایل الزامی است")
            .MaximumLength(20).WithMessage("طول شماره موبایل حداکثر ۲۰ کاراکتر است");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("رمز عبور الزامی است")
            .MinimumLength(6).WithMessage("طول رمز عبور حداقل ۶ کاراکتر است");

        RuleFor(x => x.BloodType)
            .MaximumLength(10).WithMessage("طول گروه خونی حداکثر ۱۰ کاراکتر است");

        RuleFor(x => x.BirthDate)
            .LessThan(DateTime.Now).WithMessage("تاریخ تولد باید گذشته باشد")
            .When(x => x.BirthDate.HasValue);
    }
}

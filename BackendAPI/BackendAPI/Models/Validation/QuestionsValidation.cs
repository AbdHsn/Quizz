using DataLayer.Models.Entities;
using FluentValidation;

namespace APIDotNetCore.Models.Validation
{
    public class QuestionsValidation : AbstractValidator<questions>
    {
        public QuestionsValidation()
        {
            RuleFor(r => r.question).NotNull().NotEmpty();
            RuleFor(r => r.topic).NotNull().NotEmpty();
            RuleFor(r => r.options).NotNull().NotEmpty();
            RuleFor(r => r.correct_option).NotNull().NotEmpty();
            RuleFor(r => r.time_in_minutes).GreaterThan(0);
        }
    }
}

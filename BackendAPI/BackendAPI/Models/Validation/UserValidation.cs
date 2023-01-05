using DataLayer.Models.Entities;
using FluentValidation;

namespace APIDotNetCore.Models.Validation
{
    public class UserValidation : AbstractValidator<user>
    {
        public UserValidation()
        {
            RuleFor(r => r.name).NotNull().NotEmpty();
            RuleFor(r => r.user_name).NotNull().NotEmpty();
        }
    }
}

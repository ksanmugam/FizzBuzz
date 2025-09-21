using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Server.Models.Rule
{
    public class UpdateRuleDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Divisor must be a positive number")]
        public int? Divisor { get; set; }

        [StringLength(50, MinimumLength = 1, ErrorMessage = "Replacement text must be between 1 and 50 characters")]
        public string? ReplacementText { get; set; }

        public bool? IsActive { get; set; }
    }
}

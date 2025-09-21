using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Server.Entities
{
    public class GameRule
    {
        public int Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Divisor must be a positive number")]
        public int Divisor { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Replacement text must be between 1 and 50 characters")]
        public string ReplacementText { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

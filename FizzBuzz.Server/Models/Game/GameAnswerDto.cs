using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Server.Models.Game
{
    public class GameAnswerDto
    {
        [Required]
        public string SessionId { get; set; } = string.Empty;

        [Required]
        public int Number { get; set; }

        [Required]
        public string Answer { get; set; } = string.Empty;
    }
}

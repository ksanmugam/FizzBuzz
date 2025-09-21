namespace FizzBuzz.Server.Models.Game
{
    public class GameQuestion
    {
        public int Number { get; set; }
        public string ExpectedAnswer { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}

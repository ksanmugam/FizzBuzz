namespace FizzBuzz.Server.Models.Game
{
    public class GameAnswerResponse
    {
        public bool IsCorrect { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public int NextNumber { get; set; }
        public bool GameEnded { get; set; }
    }
}

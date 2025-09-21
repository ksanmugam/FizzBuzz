namespace FizzBuzz.Server.Models.Game
{
    public class GameSession
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public List<GameQuestion> Questions { get; set; } = new();
    }
}

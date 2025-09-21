namespace FizzBuzz.Server.Models.Game
{
    public class GameSummaryDto
    {
        public string SessionId { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
        public DateTime EndedAt { get; set; }
        public TimeSpan Duration { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double AccuracyPercentage { get; set; }
        public List<QuestionSummaryDto> Questions { get; set; } = new();
    }
}

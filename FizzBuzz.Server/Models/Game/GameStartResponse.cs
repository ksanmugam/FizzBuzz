using FizzBuzz.Server.Entities;

namespace FizzBuzz.Server.Models.Game
{
    public class GameStartResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public int Number { get; set; }
        public List<GameRule> Rules { get; set; } = new();
    }
}

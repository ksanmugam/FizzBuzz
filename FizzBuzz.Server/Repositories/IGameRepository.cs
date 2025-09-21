using FizzBuzz.Server.Models.Game;

namespace FizzBuzz.Server.Repositories
{
    public interface IGameRepository
    {
        Task<GameSession> CreateSessionAsync(GameSession session);
        Task<GameSession?> GetSessionAsync(string sessionId);
        Task<GameSession> UpdateSessionAsync(GameSession session);
        Task<IEnumerable<GameSession>> GetAllSessionsAsync();
    }
}

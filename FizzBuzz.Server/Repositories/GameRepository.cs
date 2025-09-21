using FizzBuzz.Server.Models.Game;

namespace FizzBuzz.Server.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly Dictionary<string, GameSession> _sessions = new();

        public Task<GameSession> CreateSessionAsync(GameSession session)
        {
            _sessions[session.Id] = session;
            return Task.FromResult(session);
        }

        public Task<GameSession?> GetSessionAsync(string sessionId)
        {
            _sessions.TryGetValue(sessionId, out var session);
            return Task.FromResult(session);
        }

        public Task<GameSession> UpdateSessionAsync(GameSession session)
        {
            _sessions[session.Id] = session;
            return Task.FromResult(session);
        }

        public Task<IEnumerable<GameSession>> GetAllSessionsAsync()
        {
            return Task.FromResult(_sessions.Values.AsEnumerable());
        }
    }
}

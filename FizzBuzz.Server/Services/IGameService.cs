using FizzBuzz.Server.Models.Game;

namespace FizzBuzz.Server.Services
{
    public interface IGameService
    {
        Task<GameStartResponse> StartGameAsync();
        Task<GameAnswerResponse> SubmitAnswerAsync(GameAnswerDto answerDto);
        Task<GameSummaryDto?> EndGameAsync(string sessionId);
        Task<GameSummaryDto?> GetGameSummaryAsync(string sessionId);
        int GenerateRandomNumber();
    }
}

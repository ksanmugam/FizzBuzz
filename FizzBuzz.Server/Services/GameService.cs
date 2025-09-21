using FizzBuzz.Server.Models.Game;
using FizzBuzz.Server.Repositories;

namespace FizzBuzz.Server.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;
        private readonly IRuleService _ruleService;
        private readonly Random _random;

        public GameService(IGameRepository gameRepository, IRuleService ruleService)
        {
            _gameRepository = gameRepository;
            _ruleService = ruleService;
            _random = new Random();
        }

        public async Task<GameStartResponse> StartGameAsync()
        {
            var session = new GameSession();
            await _gameRepository.CreateSessionAsync(session);

            var rules = (await _ruleService.GetActiveRulesAsync()).ToList();
            var firstNumber = GenerateRandomNumber();

            return new GameStartResponse
            {
                SessionId = session.Id,
                Number = firstNumber,
                Rules = rules
            };
        }

        public async Task<GameAnswerResponse> SubmitAnswerAsync(GameAnswerDto answerDto)
        {
            var session = await _gameRepository.GetSessionAsync(answerDto.SessionId);
            if (session == null)
            {
                throw new InvalidOperationException("Invalid session ID");
            }

            var rules = await _ruleService.GetActiveRulesAsync();
            var correctAnswer = await _ruleService.ApplyRules(answerDto.Number, rules);
            var isCorrect = string.Equals(answerDto.Answer.Trim(), correctAnswer, StringComparison.OrdinalIgnoreCase);

            // Record the question
            session.Questions.Add(new GameQuestion
            {
                Number = answerDto.Number,
                ExpectedAnswer = correctAnswer,
                UserAnswer = answerDto.Answer,
                IsCorrect = isCorrect
            });

            session.TotalQuestions++;
            if (isCorrect) session.CorrectAnswers++;

            await _gameRepository.UpdateSessionAsync(session);

            var nextNumber = GenerateRandomNumber();

            return new GameAnswerResponse
            {
                IsCorrect = isCorrect,
                CorrectAnswer = correctAnswer,
                NextNumber = nextNumber,
                GameEnded = false
            };
        }

        public async Task<GameSummaryDto?> EndGameAsync(string sessionId)
        {
            var session = await _gameRepository.GetSessionAsync(sessionId);
            if (session == null) return null;

            session.EndedAt = DateTime.UtcNow;
            await _gameRepository.UpdateSessionAsync(session);

            return CreateGameSummary(session);
        }

        public async Task<GameSummaryDto?> GetGameSummaryAsync(string sessionId)
        {
            var session = await _gameRepository.GetSessionAsync(sessionId);
            return session == null ? null : CreateGameSummary(session);
        }

        public int GenerateRandomNumber()
        {
            return _random.Next(1, 101); // Generate numbers between 1 and 100
        }

        private static GameSummaryDto CreateGameSummary(GameSession session)
        {
            var endTime = session.EndedAt ?? DateTime.UtcNow;

            return new GameSummaryDto
            {
                SessionId = session.Id,
                StartedAt = session.StartedAt,
                EndedAt = endTime,
                Duration = endTime - session.StartedAt,
                TotalQuestions = session.TotalQuestions,
                CorrectAnswers = session.CorrectAnswers,
                AccuracyPercentage = session.TotalQuestions > 0
                    ? Math.Round((double)session.CorrectAnswers / session.TotalQuestions * 100, 2)
                    : 0,
                Questions = session.Questions.Select(q => new QuestionSummaryDto
                {
                    Number = q.Number,
                    ExpectedAnswer = q.ExpectedAnswer,
                    UserAnswer = q.UserAnswer,
                    IsCorrect = q.IsCorrect
                }).ToList()
            };
        }
    }
}

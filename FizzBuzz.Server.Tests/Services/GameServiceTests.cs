using FizzBuzz.Server.Entities;
using FizzBuzz.Server.Models.Game;
using FizzBuzz.Server.Repositories;
using Moq;
using Xunit;

namespace FizzBuzz.Server.Services
{
    public class GameServiceTests
    {
        private readonly Mock<IGameRepository> _mockGameRepository;
        private readonly Mock<IRuleService> _mockRuleService;
        private readonly GameService _service;

        public GameServiceTests()
        {
            _mockGameRepository = new Mock<IGameRepository>();
            _mockRuleService = new Mock<IRuleService>();
            _service = new GameService(_mockGameRepository.Object, _mockRuleService.Object);
        }

        [Fact]
        public async Task StartGameAsync_ReturnsGameStartResponse()
        {
            // Arrange
            var rules = new List<GameRule>
        {
            new() { Id = 1, Divisor = 3, ReplacementText = "Fizz", IsActive = true }
        };

            _mockGameRepository.Setup(r => r.CreateSessionAsync(It.IsAny<GameSession>()))
                .ReturnsAsync((GameSession session) => session);
            _mockRuleService.Setup(r => r.GetActiveRulesAsync()).ReturnsAsync(rules);

            // Act
            var result = await _service.StartGameAsync();

            // Assert
            Assert.NotNull(result.SessionId);
            Assert.True(result.Number > 0);
            Assert.Single(result.Rules);
            _mockGameRepository.Verify(r => r.CreateSessionAsync(It.IsAny<GameSession>()), Times.Once);
        }

        [Fact]
        public async Task SubmitAnswerAsync_WithCorrectAnswer_ReturnsTrue()
        {
            // Arrange
            var session = new GameSession { Id = "test-session" };
            var answerDto = new GameAnswerDto
            {
                SessionId = "test-session",
                Number = 15,
                Answer = "FizzBuzz"
            };
            var rules = new List<GameRule>
        {
            new() { Divisor = 3, ReplacementText = "Fizz", IsActive = true },
            new() { Divisor = 5, ReplacementText = "Buzz", IsActive = true }
        };

            _mockGameRepository.Setup(r => r.GetSessionAsync("test-session")).ReturnsAsync(session);
            _mockGameRepository.Setup(r => r.UpdateSessionAsync(It.IsAny<GameSession>()))
                .ReturnsAsync((GameSession s) => s);
            _mockRuleService.Setup(r => r.GetActiveRulesAsync()).ReturnsAsync(rules);
            _mockRuleService.Setup(r => r.ApplyRules(15, rules)).ReturnsAsync("FizzBuzz");

            // Act
            var result = await _service.SubmitAnswerAsync(answerDto);

            // Assert
            Assert.True(result.IsCorrect);
            Assert.Equal("FizzBuzz", result.CorrectAnswer);
            Assert.Single(session.Questions);
            Assert.Equal(1, session.TotalQuestions);
            Assert.Equal(1, session.CorrectAnswers);
        }

        [Fact]
        public async Task SubmitAnswerAsync_WithInvalidSession_ThrowsException()
        {
            // Arrange
            var answerDto = new GameAnswerDto
            {
                SessionId = "invalid-session",
                Number = 15,
                Answer = "FizzBuzz"
            };

            _mockGameRepository.Setup(r => r.GetSessionAsync("invalid-session")).ReturnsAsync((GameSession?)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.SubmitAnswerAsync(answerDto));
        }

        [Fact]
        public void GenerateRandomNumber_ReturnsBetweenOneAndHundred()
        {
            // Act
            var result = _service.GenerateRandomNumber();

            // Assert
            Assert.InRange(result, 1, 100);
        }

        [Fact]
        public async Task EndGameAsync_ValidSession_ReturnsGameSummary()
        {
            // Arrange
            var session = new GameSession
            {
                Id = "test-session",
                TotalQuestions = 5,
                CorrectAnswers = 4,
                StartedAt = DateTime.UtcNow.AddMinutes(-10)
            };

            _mockGameRepository.Setup(r => r.GetSessionAsync("test-session")).ReturnsAsync(session);
            _mockGameRepository.Setup(r => r.UpdateSessionAsync(It.IsAny<GameSession>()))
                .ReturnsAsync((GameSession s) => s);

            // Act
            var result = await _service.EndGameAsync("test-session");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-session", result.SessionId);
            Assert.Equal(5, result.TotalQuestions);
            Assert.Equal(4, result.CorrectAnswers);
            Assert.Equal(80, result.AccuracyPercentage);
            Assert.NotNull(session.EndedAt);
        }
    }
}

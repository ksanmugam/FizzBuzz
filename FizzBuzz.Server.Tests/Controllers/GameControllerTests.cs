using FizzBuzz.Server.Controllers;
using FizzBuzz.Server.Models;
using FizzBuzz.Server.Models.Game;
using FizzBuzz.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace FizzBuzz.Server.Tests.Controllers
{
    public class GameControllerTests
    {
        private readonly Mock<IGameService> _gameServiceMock;
        private readonly Mock<ILogger<GameController>> _loggerMock;
        private readonly GameController _controller;

        public GameControllerTests()
        {
            _gameServiceMock = new Mock<IGameService>();
            _loggerMock = new Mock<ILogger<GameController>>();
            _controller = new GameController(_gameServiceMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task StartGame_ReturnsOk_WhenServiceSucceeds()
        {
            // Arrange
            var expected = new GameStartResponse { SessionId = "123" };
            _gameServiceMock.Setup(s => s.StartGameAsync()).ReturnsAsync(expected);

            // Act
            var result = await _controller.StartGame();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expected, okResult.Value);
        }

        [Fact]
        public async Task StartGame_ReturnsServerError_WhenServiceThrows()
        {
            // Arrange
            _gameServiceMock.Setup(s => s.StartGameAsync()).ThrowsAsync(new Exception("fail"));

            // Act
            var result = await _controller.StartGame();

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Fact]
        public async Task SubmitAnswer_ReturnsOk_WhenValid()
        {
            // Arrange
            var answerDto = new GameAnswerDto { SessionId = "123", Answer = "Fizz" };
            var response = new GameAnswerResponse { IsCorrect = true };
            _gameServiceMock.Setup(s => s.SubmitAnswerAsync(answerDto)).ReturnsAsync(response);

            // Act
            var result = await _controller.SubmitAnswer(answerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task SubmitAnswer_ReturnsBadRequest_WhenModelStateInvalid()
        {
            // Arrange
            _controller.ModelState.AddModelError("Answer", "Required");
            var answerDto = new GameAnswerDto();

            // Act
            var result = await _controller.SubmitAnswer(answerDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SubmitAnswer_ReturnsBadRequest_WhenInvalidOperationExceptionThrown()
        {
            // Arrange
            var answerDto = new GameAnswerDto { SessionId = "123" };
            _gameServiceMock
                .Setup(s => s.SubmitAnswerAsync(answerDto))
                .ThrowsAsync(new InvalidOperationException("Invalid operation"));

            // Act
            var result = await _controller.SubmitAnswer(answerDto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid operation", badRequest.Value);
        }

        [Fact]
        public async Task EndGame_ReturnsOk_WhenSummaryExists()
        {
            // Arrange
            var sessionId = "123";
            var summary = new GameSummaryDto { SessionId = sessionId };
            _gameServiceMock.Setup(s => s.EndGameAsync(sessionId)).ReturnsAsync(summary);

            // Act
            var result = await _controller.EndGame(sessionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(summary, okResult.Value);
        }

        [Fact]
        public async Task EndGame_ReturnsNotFound_WhenSummaryNull()
        {
            // Arrange
            var sessionId = "123";
            _gameServiceMock.Setup(s => s.EndGameAsync(sessionId)).ReturnsAsync((GameSummaryDto?)null);

            // Act
            var result = await _controller.EndGame(sessionId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Game session {sessionId} not found", notFound.Value);
        }

        [Fact]
        public async Task GetGameSummary_ReturnsOk_WhenSummaryExists()
        {
            // Arrange
            var sessionId = "123";
            var summary = new GameSummaryDto { SessionId = sessionId };
            _gameServiceMock.Setup(s => s.GetGameSummaryAsync(sessionId)).ReturnsAsync(summary);

            // Act
            var result = await _controller.GetGameSummary(sessionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(summary, okResult.Value);
        }

        [Fact]
        public async Task GetGameSummary_ReturnsNotFound_WhenSummaryNull()
        {
            // Arrange
            var sessionId = "123";
            _gameServiceMock.Setup(s => s.GetGameSummaryAsync(sessionId)).ReturnsAsync((GameSummaryDto?)null);

            // Act
            var result = await _controller.GetGameSummary(sessionId);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Game session {sessionId} not found", notFound.Value);
        }
    }
}

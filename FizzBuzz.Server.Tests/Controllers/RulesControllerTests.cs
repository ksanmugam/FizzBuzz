using FizzBuzz.Server.Controllers;
using FizzBuzz.Server.Entities;
using FizzBuzz.Server.Models;
using FizzBuzz.Server.Models.Rule;
using FizzBuzz.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace FizzBuzz.Server.Tests.Controllers
{
    public class RulesControllerTests
    {
        private readonly Mock<IRuleService> _mockRuleService;
        private readonly Mock<ILogger<RulesController>> _mockLogger;
        private readonly RulesController _controller;

        public RulesControllerTests()
        {
            _mockRuleService = new Mock<IRuleService>();
            _mockLogger = new Mock<ILogger<RulesController>>();
            _controller = new RulesController(_mockRuleService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllRules_ReturnsOkWithRules()
        {
            // Arrange
            var rules = new List<GameRule>
        {
            new() { Id = 1, Divisor = 3, ReplacementText = "Fizz" }
        };
            _mockRuleService.Setup(s => s.GetAllRulesAsync()).ReturnsAsync(rules);

            // Act
            var result = await _controller.GetAllRules();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedRules = Assert.IsAssignableFrom<IEnumerable<GameRule>>(okResult.Value);
            Assert.Single(returnedRules);
        }

        [Fact]
        public async Task CreateRule_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = new CreateRuleDto { Divisor = 7, ReplacementText = "Lucky" };
            var createdRule = new GameRule { Id = 3, Divisor = 7, ReplacementText = "Lucky" };

            _mockRuleService.Setup(s => s.CreateRuleAsync(createDto)).ReturnsAsync(createdRule);

            // Act
            var result = await _controller.CreateRule(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(RulesController.GetRule), createdAtActionResult.ActionName);
            Assert.Equal(createdRule, createdAtActionResult.Value);
        }

        [Fact]
        public async Task CreateRule_WithDuplicateDivisor_ReturnsConflict()
        {
            // Arrange
            var createDto = new CreateRuleDto { Divisor = 3, ReplacementText = "Test" };
            _mockRuleService.Setup(s => s.CreateRuleAsync(createDto))
                .ThrowsAsync(new InvalidOperationException("Divisor already exists"));

            // Act
            var result = await _controller.CreateRule(createDto);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal("Divisor already exists", conflictResult.Value);
        }

        [Fact]
        public async Task DeleteRule_ExistingRule_ReturnsNoContent()
        {
            // Arrange
            _mockRuleService.Setup(s => s.DeleteRuleAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteRule(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteRule_NonExistingRule_ReturnsNotFound()
        {
            // Arrange
            _mockRuleService.Setup(s => s.DeleteRuleAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteRule(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Contains("999", notFoundResult.Value?.ToString());
        }
    }
}

using FizzBuzz.Server.Entities;
using FizzBuzz.Server.Models;
using FizzBuzz.Server.Models.Rule;
using FizzBuzz.Server.Repositories;
using Moq;
using Xunit;

namespace FizzBuzz.Server.Services
{
    public class RuleServiceTests
    {
        private readonly Mock<IRuleRepository> _mockRepository;
        private readonly RuleService _service;

        public RuleServiceTests()
        {
            _mockRepository = new Mock<IRuleRepository>();
            _service = new RuleService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetAllRulesAsync_ReturnsAllRules()
        {
            // Arrange
            var rules = new List<GameRule>
            {
                new() { Id = 1, Divisor = 3, ReplacementText = "Fizz", IsActive = true },
                new() { Id = 2, Divisor = 5, ReplacementText = "Buzz", IsActive = true }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(rules);

            // Act
            var result = await _service.GetAllRulesAsync();

            // Assert
            Assert.Equal(2, result.Count());
            _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateRuleAsync_WithExistingDivisor_ThrowsException()
        {
            // Arrange
            var createDto = new CreateRuleDto { Divisor = 3, ReplacementText = "Test" };
            _mockRepository.Setup(r => r.ExistsAsync(3, null)).ReturnsAsync(true);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateRuleAsync(createDto));
            _mockRepository.Verify(r => r.ExistsAsync(3, null), Times.Once);
            _mockRepository.Verify(r => r.CreateAsync(It.IsAny<GameRule>()), Times.Never);
        }

        [Fact]
        public async Task CreateRuleAsync_WithValidData_CreatesRule()
        {
            // Arrange
            var createDto = new CreateRuleDto { Divisor = 7, ReplacementText = "Lucky", IsActive = true };
            var createdRule = new GameRule { Id = 3, Divisor = 7, ReplacementText = "Lucky", IsActive = true };

            _mockRepository.Setup(r => r.ExistsAsync(7, null)).ReturnsAsync(false);
            _mockRepository.Setup(r => r.CreateAsync(It.IsAny<GameRule>())).ReturnsAsync(createdRule);

            // Act
            var result = await _service.CreateRuleAsync(createDto);

            // Assert
            Assert.Equal(7, result.Divisor);
            Assert.Equal("Lucky", result.ReplacementText);
            _mockRepository.Verify(r => r.CreateAsync(It.IsAny<GameRule>()), Times.Once);
        }

        [Theory]
        [InlineData(15, "FizzBuzz")] // Divisible by both 3 and 5
        [InlineData(3, "Fizz")] // Divisible by 3
        [InlineData(5, "Buzz")] // Divisible by 5
        [InlineData(7, "7")] // Not divisible by any
        public async Task ApplyRules_ReturnsCorrectResult(int number, string expected)
        {
            // Arrange
            var rules = new List<GameRule>
            {
                new() { Divisor = 3, ReplacementText = "Fizz", IsActive = true },
                new() { Divisor = 5, ReplacementText = "Buzz", IsActive = true }
            };

            // Act
            var result = await _service.ApplyRules(number, rules);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public async Task DeleteRuleAsync_LastActiveRule_ThrowsException()
        {
            // Arrange
            var rule = new GameRule { Id = 1, IsActive = true };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(rule);
            _mockRepository.Setup(r => r.GetActiveRuleCountAsync()).ReturnsAsync(1);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.DeleteRuleAsync(1));
            _mockRepository.Verify(r => r.DeleteAsync(1), Times.Never);
        }
    }
}

using FizzBuzz.Server.Models.Game;
using FizzBuzz.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly ILogger<GameController> _logger;

        public GameController(IGameService gameService, ILogger<GameController> logger)
        {
            _gameService = gameService;
            _logger = logger;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartGame()
        {
            try
            {
                var gameStart = await _gameService.StartGameAsync();
                return Ok(gameStart);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting game");
                return StatusCode(500, "An error occurred while starting the game");
            }
        }

        [HttpPost("answer")]
        public async Task<IActionResult> SubmitAnswer([FromBody] GameAnswerDto answerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _gameService.SubmitAnswerAsync(answerDto);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting answer for session {SessionId}", answerDto.SessionId);
                return StatusCode(500, "An error occurred while submitting the answer");
            }
        }

        [HttpPost("end/{sessionId}")]
        public async Task<IActionResult> EndGame(string sessionId)
        {
            try
            {
                var summary = await _gameService.EndGameAsync(sessionId);
                if (summary == null)
                {
                    return NotFound($"Game session {sessionId} not found");
                }
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ending game session {SessionId}", sessionId);
                return StatusCode(500, "An error occurred while ending the game");
            }
        }

        [HttpGet("summary/{sessionId}")]
        public async Task<IActionResult> GetGameSummary(string sessionId)
        {
            try
            {
                var summary = await _gameService.GetGameSummaryAsync(sessionId);
                if (summary == null)
                {
                    return NotFound($"Game session {sessionId} not found");
                }
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving game summary for session {SessionId}", sessionId);
                return StatusCode(500, "An error occurred while retrieving the game summary");
            }
        }
    }
}

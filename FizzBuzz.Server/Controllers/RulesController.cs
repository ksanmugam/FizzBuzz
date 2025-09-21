using FizzBuzz.Server.Models.Rule;
using FizzBuzz.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesController : ControllerBase
    {
        private readonly IRuleService _ruleService;
        private readonly ILogger<RulesController> _logger;

        public RulesController(IRuleService ruleService, ILogger<RulesController> logger)
        {
            _ruleService = ruleService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRules()
        {
            try
            {
                var rules = await _ruleService.GetAllRulesAsync();
                return Ok(rules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all rules");
                return StatusCode(500, "An error occurred while retrieving rules");
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveRules()
        {
            try
            {
                var rules = await _ruleService.GetActiveRulesAsync();
                return Ok(rules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active rules");
                return StatusCode(500, "An error occurred while retrieving active rules");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRule(int id)
        {
            try
            {
                var rule = await _ruleService.GetRuleByIdAsync(id);
                if (rule == null)
                {
                    return NotFound($"Rule with ID {id} not found");
                }
                return Ok(rule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rule {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the rule");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateRule([FromBody] CreateRuleDto createRuleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var rule = await _ruleService.CreateRuleAsync(createRuleDto);
                return CreatedAtAction(nameof(GetRule), new { id = rule.Id }, rule);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating rule");
                return StatusCode(500, "An error occurred while creating the rule");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRule(int id, [FromBody] UpdateRuleDto updateRuleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var rule = await _ruleService.UpdateRuleAsync(id, updateRuleDto);
                if (rule == null)
                {
                    return NotFound($"Rule with ID {id} not found");
                }
                return Ok(rule);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rule {Id}", id);
                return StatusCode(500, "An error occurred while updating the rule");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            try
            {
                var success = await _ruleService.DeleteRuleAsync(id);
                if (!success)
                {
                    return NotFound($"Rule with ID {id} not found");
                }
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting rule {Id}", id);
                return StatusCode(500, "An error occurred while deleting the rule");
            }
        }
    }
}

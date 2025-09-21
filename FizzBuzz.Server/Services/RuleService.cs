using FizzBuzz.Server.Entities;
using FizzBuzz.Server.Models.Rule;
using FizzBuzz.Server.Repositories;
using System.Text;

namespace FizzBuzz.Server.Services
{
    public class RuleService : IRuleService
    {
        private readonly IRuleRepository _ruleRepository;

        public RuleService(IRuleRepository ruleRepository)
        {
            _ruleRepository = ruleRepository;
        }

        public async Task<IEnumerable<GameRule>> GetAllRulesAsync()
        {
            return await _ruleRepository.GetAllAsync();
        }

        public async Task<IEnumerable<GameRule>> GetActiveRulesAsync()
        {
            return await _ruleRepository.GetActiveRulesAsync();
        }

        public async Task<GameRule?> GetRuleByIdAsync(int id)
        {
            return await _ruleRepository.GetByIdAsync(id);
        }

        public async Task<GameRule> CreateRuleAsync(CreateRuleDto createRuleDto)
        {
            // Check if rule with same divisor already exists
            if (await _ruleRepository.ExistsAsync(createRuleDto.Divisor))
            {
                throw new InvalidOperationException($"A rule with divisor {createRuleDto.Divisor} already exists");
            }

            var rule = new GameRule
            {
                Divisor = createRuleDto.Divisor,
                ReplacementText = createRuleDto.ReplacementText,
                IsActive = createRuleDto.IsActive
            };

            return await _ruleRepository.CreateAsync(rule);
        }

        public async Task<GameRule?> UpdateRuleAsync(int id, UpdateRuleDto updateRuleDto)
        {
            var existingRule = await _ruleRepository.GetByIdAsync(id);
            if (existingRule == null) return null;

            // If divisor is being updated, check for conflicts
            if (updateRuleDto.Divisor.HasValue &&
                updateRuleDto.Divisor.Value != existingRule.Divisor &&
                await _ruleRepository.ExistsAsync(updateRuleDto.Divisor.Value, id))
            {
                throw new InvalidOperationException($"A rule with divisor {updateRuleDto.Divisor.Value} already exists");
            }

            // Apply updates
            if (updateRuleDto.Divisor.HasValue)
                existingRule.Divisor = updateRuleDto.Divisor.Value;

            if (!string.IsNullOrEmpty(updateRuleDto.ReplacementText))
                existingRule.ReplacementText = updateRuleDto.ReplacementText;

            if (updateRuleDto.IsActive.HasValue)
                existingRule.IsActive = updateRuleDto.IsActive.Value;

            return await _ruleRepository.UpdateAsync(id, existingRule);
        }

        public async Task<bool> DeleteRuleAsync(int id)
        {
            // Ensure at least one rule remains
            var activeRuleCount = await _ruleRepository.GetActiveRuleCountAsync();
            var ruleToDelete = await _ruleRepository.GetByIdAsync(id);

            if (ruleToDelete?.IsActive == true && activeRuleCount <= 1)
            {
                throw new InvalidOperationException("Cannot delete the last active rule. At least one rule must remain active.");
            }

            return await _ruleRepository.DeleteAsync(id);
        }

        public Task<string> ApplyRules(int number, IEnumerable<GameRule> rules)
        {
            var result = new StringBuilder();
            bool hasMatch = false;

            foreach (var rule in rules.Where(r => r.IsActive).OrderBy(r => r.Divisor))
            {
                if (number % rule.Divisor == 0)
                {
                    result.Append(rule.ReplacementText);
                    hasMatch = true;
                }
            }

            return Task.FromResult(hasMatch ? result.ToString() : number.ToString());
        }
    }
}

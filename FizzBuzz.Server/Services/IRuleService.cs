using FizzBuzz.Server.Entities;
using FizzBuzz.Server.Models.Rule;

namespace FizzBuzz.Server.Services
{
    public interface IRuleService
    {
        Task<IEnumerable<GameRule>> GetAllRulesAsync();
        Task<IEnumerable<GameRule>> GetActiveRulesAsync();
        Task<GameRule?> GetRuleByIdAsync(int id);
        Task<GameRule> CreateRuleAsync(CreateRuleDto createRuleDto);
        Task<GameRule?> UpdateRuleAsync(int id, UpdateRuleDto updateRuleDto);
        Task<bool> DeleteRuleAsync(int id);
        Task<string> ApplyRules(int number, IEnumerable<GameRule> rules);
    }
}

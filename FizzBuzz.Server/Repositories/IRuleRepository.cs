using FizzBuzz.Server.Entities;

namespace FizzBuzz.Server.Repositories
{
    public interface IRuleRepository
    {
        Task<IEnumerable<GameRule>> GetAllAsync();
        Task<IEnumerable<GameRule>> GetActiveRulesAsync();
        Task<GameRule?> GetByIdAsync(int id);
        Task<GameRule> CreateAsync(GameRule rule);
        Task<GameRule?> UpdateAsync(int id, GameRule rule);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int divisor, int? excludeId = null);
        Task<int> GetActiveRuleCountAsync();
    }
}

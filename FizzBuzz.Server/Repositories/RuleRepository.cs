using FizzBuzz.Server.Data;
using FizzBuzz.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz.Server.Repositories
{
    public class RuleRepository : IRuleRepository
    {
        private readonly GameDbContext _context;

        public RuleRepository(GameDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GameRule>> GetAllAsync()
        {
            return await _context.GameRules
                .OrderBy(r => r.Divisor)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameRule>> GetActiveRulesAsync()
        {
            return await _context.GameRules
                .Where(r => r.IsActive)
                .OrderBy(r => r.Divisor)
                .ToListAsync();
        }

        public async Task<GameRule?> GetByIdAsync(int id)
        {
            return await _context.GameRules.FindAsync(id);
        }

        public async Task<GameRule> CreateAsync(GameRule rule)
        {
            rule.CreatedAt = DateTime.UtcNow;
            rule.UpdatedAt = DateTime.UtcNow;

            _context.GameRules.Add(rule);
            await _context.SaveChangesAsync();
            return rule;
        }

        public async Task<GameRule?> UpdateAsync(int id, GameRule rule)
        {
            var existingRule = await _context.GameRules.FindAsync(id);
            if (existingRule == null) return null;

            existingRule.Divisor = rule.Divisor;
            existingRule.ReplacementText = rule.ReplacementText;
            existingRule.IsActive = rule.IsActive;
            existingRule.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingRule;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rule = await _context.GameRules.FindAsync(id);
            if (rule == null) return false;

            _context.GameRules.Remove(rule);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int divisor, int? excludeId = null)
        {
            return await _context.GameRules
                .AnyAsync(r => r.Divisor == divisor && (excludeId == null || r.Id != excludeId));
        }

        public async Task<int> GetActiveRuleCountAsync()
        {
            return await _context.GameRules.CountAsync(r => r.IsActive);
        }
    }
}

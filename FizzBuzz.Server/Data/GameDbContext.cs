using FizzBuzz.Server.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace FizzBuzz.Server.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public DbSet<GameRule> GameRules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed default rules
            modelBuilder.Entity<GameRule>().HasData(
                new GameRule
                {
                    Id = 1,
                    Divisor = 3,
                    ReplacementText = "Fizz",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new GameRule
                {
                    Id = 2,
                    Divisor = 5,
                    ReplacementText = "Buzz",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Configure indexes
            modelBuilder.Entity<GameRule>()
                .HasIndex(r => r.Divisor)
                .HasAnnotation("Relational:IndexName", "IX_GameRules_Divisor");

            modelBuilder.Entity<GameRule>()
                .HasIndex(r => r.IsActive)
                .HasAnnotation("Relational:IndexName", "IX_GameRules_IsActive");
        }
    }
}

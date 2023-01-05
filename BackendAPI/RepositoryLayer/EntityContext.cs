using DataLayer.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer
{
    public class EntityContext : DbContext
    {
        public EntityContext()
        {
        }

        public EntityContext(DbContextOptions<EntityContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<user>(entity =>
            {
                entity.ToTable("user");
                entity.Property(p => p.id).ValueGeneratedOnAdd().HasColumnName("id");
            });   
            modelBuilder.Entity<questions>(entity =>
            {
                entity.ToTable("questions");
                entity.Property(p => p.id).ValueGeneratedOnAdd().HasColumnName("id");
            });
            modelBuilder.Entity<answer>(entity =>
            {
                entity.ToTable("answer");
                entity.Property(p => p.id).ValueGeneratedOnAdd().HasColumnName("id");
            });
        }

        #region TableEntities
        public virtual DbSet<user> User { get; set; } = null!;
        public virtual DbSet<questions> Questions { get; set; } = null!;
        public virtual DbSet<answer> Answer { get; set; } = null!;
        #endregion TableEntities
    }

}

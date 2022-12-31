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

            //modelBuilder.Entity<TotalRecordCountGLB>(entity =>
            //{
            //    entity.HasNoKey();
            //});
        }

        #region TableEntities
        public virtual DbSet<user> User { get; set; } = null!;
        #endregion TableEntities
    }

}

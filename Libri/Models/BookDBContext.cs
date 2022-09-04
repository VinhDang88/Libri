using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Libri.Models
{
    public partial class BookDBContext : DbContext
    {
        public BookDBContext()
        {
        }

        public BookDBContext(DbContextOptions<BookDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<DeniedList> DeniedLists { get; set; } = null!;
        public virtual DbSet<FavoriteList> FavoriteLists { get; set; } = null!;
        public virtual DbSet<ReadList> ReadLists { get; set; } = null!;
        public virtual DbSet<Review> Reviews { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<Vote> Votes { get; set; } = null!;
        public virtual DbSet<WishList> WishLists { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer($"Data Source={Secrets.dataSource};Initial Catalog=BookDB;User Id={Secrets.userId}; Password={Secrets.password};");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeniedList>(entity =>
            {
                entity.Property(e => e.DeniedListId).HasMaxLength(25);

                entity.Property(e => e.Isbn).HasMaxLength(255);

                entity.HasOne(d => d.DeniedListNavigation)
                    .WithMany(p => p.DeniedLists)
                    .HasForeignKey(d => d.DeniedListId)
                    .HasConstraintName("FK__DeniedLis__Denie__628FA481");
            });

            modelBuilder.Entity<FavoriteList>(entity =>
            {
                entity.Property(e => e.Author).HasMaxLength(255);

                entity.Property(e => e.AverageRating).HasColumnName("averageRating");

                entity.Property(e => e.FavoriteListId).HasMaxLength(25);

                entity.Property(e => e.Isbn).HasMaxLength(255);

                entity.Property(e => e.RatingsCount).HasColumnName("ratingsCount");

                entity.Property(e => e.Subject).HasMaxLength(255);

                entity.Property(e => e.Title).HasMaxLength(255);

                entity.HasOne(d => d.FavoriteListNavigation)
                    .WithMany(p => p.FavoriteLists)
                    .HasForeignKey(d => d.FavoriteListId)
                    .HasConstraintName("FK__FavoriteL__Favor__6754599E");
            });

            modelBuilder.Entity<ReadList>(entity =>
            {
                entity.Property(e => e.Isbn).HasMaxLength(255);

                entity.Property(e => e.ReadListId).HasMaxLength(25);

                entity.HasOne(d => d.ReadListNavigation)
                    .WithMany(p => p.ReadLists)
                    .HasForeignKey(d => d.ReadListId)
                    .HasConstraintName("FK__ReadLists__ReadL__60A75C0F");
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.Property(e => e.Author).HasMaxLength(255);

                entity.Property(e => e.BookTitle).HasMaxLength(255);

                entity.Property(e => e.DatePosted).HasColumnType("datetime");

                entity.Property(e => e.Isbn).HasMaxLength(255);

                entity.Property(e => e.Review1)
                    .HasMaxLength(1500)
                    .HasColumnName("Review");

                entity.Property(e => e.UserId).HasMaxLength(25);

                entity.Property(e => e.UserName).HasMaxLength(255);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Reviews__UserId__72C60C4A");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasMaxLength(25);

                entity.Property(e => e.FirstName).HasMaxLength(255);

                entity.Property(e => e.LastName).HasMaxLength(255);

                entity.Property(e => e.Name).HasMaxLength(255);

                entity.Property(e => e.PhotoUrl).HasMaxLength(255);
            });

            modelBuilder.Entity<Vote>(entity =>
            {
                entity.Property(e => e.UserId).HasMaxLength(25);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Votes__UserId__75A278F5");
            });

            modelBuilder.Entity<WishList>(entity =>
            {
                entity.Property(e => e.Isbn).HasMaxLength(255);

                entity.Property(e => e.WishListId).HasMaxLength(25);

                entity.HasOne(d => d.WishListNavigation)
                    .WithMany(p => p.WishLists)
                    .HasForeignKey(d => d.WishListId)
                    .HasConstraintName("FK__WishLists__WishL__5EBF139D");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

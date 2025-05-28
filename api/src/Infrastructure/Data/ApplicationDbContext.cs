using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Ride> Rides { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Dni)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.RefreshToken)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.GithubId)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.AuthProvider)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.AccountStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Ride>()
                .HasOne(r => r.OriginFavoritePlace)
                .WithMany() 
                .HasForeignKey(r => r.OriginFavoritePlaceId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Ride>()
                .HasOne(r => r.DestinationFavoritePlace)
                .WithMany()
                .HasForeignKey(r => r.DestinationFavoritePlaceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ride>()
                .HasOne(r => r.Passeger)
                .WithMany()
                .HasForeignKey(r => r.PassegerId);

            modelBuilder.Entity<Ride>()
                .HasOne(r => r.Driver)
                .WithMany()
                .HasForeignKey(r => r.DriverId);
        }
    }
}

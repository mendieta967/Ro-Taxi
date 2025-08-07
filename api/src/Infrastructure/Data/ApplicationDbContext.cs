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
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<RideRejection> RideRejections { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<FavoriteLocation> FavoriteLocations { get; set; }
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
                .HasOne(r => r.Passeger)
                .WithMany()
                .HasForeignKey(r => r.PassegerId);

            modelBuilder.Entity<Ride>()
                .HasOne(r => r.Driver)
                .WithMany()
                .HasForeignKey(r => r.DriverId);

            modelBuilder.Entity<Ride>()
                 .HasIndex(r => new { r.Status, r.ScheduledAt });


            modelBuilder.Entity<RideRejection>()
                 .HasIndex(r => new { r.DriverId, r.RideId })
                 .IsUnique();

            modelBuilder.Entity<RideRejection>()
                .HasOne<Ride>()
                .WithMany()
                .HasForeignKey(r => r.RideId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RideRejection>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.DriverId)
                .OnDelete(DeleteBehavior.Cascade);



            modelBuilder.Entity<Vehicle>()
                .HasOne(r => r.Driver)
                .WithMany()
                .HasForeignKey(r => r.DriverId);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.MultiTenancy;
using Event_Planning_System.Enitities;

namespace Event_Planning_System.EntityFrameworkCore
{
    public class Event_Planning_SystemDbContext : AbpZeroDbContext<Tenant, Role, User, Event_Planning_SystemDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<BudgetExpense> Budgets { get; set; }
        public DbSet<ToDoCheckList> ToDoChecks { get; set; }

        public DbSet<Interest>  interests { get; set; }
        public Event_Planning_SystemDbContext(DbContextOptions<Event_Planning_SystemDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.BudgetExpense)
                .WithMany()
                .HasForeignKey(e => e.BudgetId)
                .OnDelete(DeleteBehavior.Restrict); // Set ON DELETE to NO ACTION or RESTRICT

           

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Event)
                .WithMany(e => e.Notifications)
                .HasForeignKey(n => n.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<ToDoCheckList>()
          .HasOne(t => t.Event)
          .WithMany(e => e.ToDoCheckLists)
          .HasForeignKey(t => t.EventId)
          .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ToDoCheckList>()
                .HasOne(t => t.User)
                .WithMany(u => u.ToDoChecks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade); // This can stay as Cascade


        }





    }


    }


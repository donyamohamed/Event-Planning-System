using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.MultiTenancy;
using Event_Planning_System.Entities;
using Event_Planning_System.Enitities;

namespace Event_Planning_System.EntityFrameworkCore
{
	public class Event_Planning_SystemDbContext : AbpZeroDbContext<Tenant, Role, User, Event_Planning_SystemDbContext>
	{
		/* Define a DbSet for each entity of the application */
		public DbSet<notification> Notifications { get; set; }
		public DbSet<Event> Events { get; set; }
		public DbSet<Guest> Guests { get; set; }
		public DbSet<BudgetExpense> Budgets { get; set; }
		public DbSet<ToDoCheckList> ToDoChecks { get; set; }
		public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatUserConnection> ChatUserConnections { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
		public DbSet<Interest> interests { get; set; }
        public DbSet<FavoriteEvent> FavoriteEvents { get; set; }
        public DbSet<GuestsFeedback> GuestsFeedback { get; set; }
        public DbSet<GuestEvent> GuestEvents { get; set; }

        public DbSet<Payment> payments { get; set; }

		public Event_Planning_SystemDbContext(DbContextOptions<Event_Planning_SystemDbContext> options)
			: base(options)
		{
		}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<notification>()
                .HasOne(n => n.Event)
                .WithMany(e => e.Notifications)
                .HasForeignKey(n => n.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ToDoCheckList>()
                .HasOne(t => t.Event)
                .WithMany(e => e.ToDoCheckLists)
                .HasForeignKey(t => t.EventId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<ToDoCheckList>()
                .HasOne(t => t.User)
                .WithMany(u => u.ToDoChecks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BudgetExpense>()
                .HasOne(b => b.Event)
                .WithMany(e => e.Budgets)
                .HasForeignKey(b => b.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GuestEvent>().ToTable("GuestEvents");

            modelBuilder.Entity<GuestEvent>()
                .HasKey(ge => new { ge.GuestId, ge.EventId });

            modelBuilder.Entity<GuestEvent>()
                .HasOne(ge => ge.Guest)
                .WithMany(g => g.GuestEvents)
                .HasForeignKey(ge => ge.GuestId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<GuestEvent>()
                .HasOne(ge => ge.Event)
                .WithMany(e => e.GuestEvents)
                .HasForeignKey(ge => ge.EventId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.EmailAddress)
                    .IsUnique()
                    .HasAnnotation("RegularExpression", @"^[^@\s]+@[^@\s]+\.[^@\s]+$");

                entity.Property(u => u.Password)
                    .IsRequired()
                    .HasAnnotation("RegularExpression",
                        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
                    .HasAnnotation("MinLength", 8);
            });

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Event)
                .WithMany(e => e.Feedbacks)
                .HasForeignKey(f => f.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feedback>()
                .HasIndex(f => new { f.EventId, f.UserId })
                .IsUnique();
            modelBuilder.Entity<FavoriteEvent>()
                .HasKey(fe => fe.Id);

            modelBuilder.Entity<FavoriteEvent>()
                .HasOne(fe => fe.User)
                .WithMany(u => u.FavoriteEvents)
                .HasForeignKey(fe => fe.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<FavoriteEvent>()
                .HasOne(fe => fe.Event)
                .WithMany(e => e.FavoriteEvents)
                .HasForeignKey(fe => fe.EventId)
                .OnDelete(DeleteBehavior.Restrict); 
        }




    }
}

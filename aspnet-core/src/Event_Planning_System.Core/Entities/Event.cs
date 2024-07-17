using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public enum EventCategory
{
    Concert,
    Conference,
    Workshop,
    Seminar,
    Party,
    Exam,
    Birthday,
    Graduation,
    Baby_Shower,
    Wedding,
    Gathering,
    Other
}

public enum EventType
{
    Paid,
    Free
}


namespace Event_Planning_System.Enitities
{
    public class Event : IEntity<int>
    {

        public int Id { get; set; }
        [Required(ErrorMessage = "Event name is required.")]
        [StringLength(100, ErrorMessage = "Event name can't be longer than 100 characters.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
        public string Description { get; set; }
        public bool isRead { get; set; } = false;
		[Required(ErrorMessage = "Location is required.")]
        [StringLength(200, ErrorMessage = "Location can't be longer than 200 characters.")]
        public string Location { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        public bool IsPublic { get; set; }

        
        private int _maxCount;

        [Range(1, 10000, ErrorMessage = "Max count must be between 1 and 10000.")]
        public int MaxCount
        {
            get => _maxCount;
            set
            {
                _maxCount = value;
                NumberOfTickets = value;
            }
        }

        public int NumberOfTickets { get; set; }

        [RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
        public string EventImg { get; set; }

        public EventCategory Category { get; set; }

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public EventType Type { get; set; }

        public int? TicketPrice { get; set; }

        public virtual ICollection<notification> Notifications { get; set; } = new List<notification>();
        public virtual ICollection<Guest> Guests { get; set; } = new List<Guest>();

        public virtual ICollection<BudgetExpense> Budgets { get; set; } = new List<BudgetExpense>();

        public virtual ICollection<ToDoCheckList> ToDoCheckLists { get; set; } = new List<ToDoCheckList>();
        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
		public virtual ICollection<GuestsFeedback> GuestsFeedback { get; set; } = new List<GuestsFeedback>();
		public ICollection<GuestEvent> GuestEvents { get; set; }
        public ICollection<FavoriteEvent> FavoriteEvents { get; set; } = new List<FavoriteEvent>();
        public int? PlaceId { get; set; }
        [ForeignKey("PlaceId")]
        public virtual SupplierPlaces SupplierPlaces { get; set; }
        public bool RequestPlace { get; set; }

        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
    }
}
using Abp.Domain.Entities.Auditing;
using Event_Planning_System.Authorization.Users;
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

namespace Event_Planning_System.Enitities
{
    public class Event
    {
		public int Id { get; set; }
		[Required(ErrorMessage = "Event name is required.")]
		[StringLength(100, ErrorMessage = "Event name can't be longer than 100 characters.")]
		public string Name { get; set; }

		[StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
		public string Description { get; set; }

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

		[Range(1, 10000, ErrorMessage = "Max count must be between 1 and 10000.")]
		public int MaxCount { get; set; }

		[RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
		public string EventImg { get; set; }

		public EventCategory Category { get; set; }

		public long UserId { get; set; }
		[ForeignKey("UserId")]
		public virtual User User { get; set; }

		public int BudgetId { get; set; }
		[ForeignKey("BudgetId")]
		public virtual BudgetExpense BudgetExpense { get; set; }

		public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
		public virtual ICollection<Guest> Guests { get; set; } = new List<Guest>();
		public virtual ICollection<ToDoCheckList> ToDoCheckLists { get; set; } = new List<ToDoCheckList>();


	}
}

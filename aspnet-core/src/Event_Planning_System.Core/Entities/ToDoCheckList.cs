using Abp.Domain.Entities.Auditing;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public enum StatusList
{
    Todo,
    InProgress,
    Done
}
namespace Event_Planning_System.Enitities
{
    public class ToDoCheckList : FullAuditedEntity<Guid>
    {
		[Required(ErrorMessage = "Status is required.")]
		public StatusList Status { get; set; }

		[Required(ErrorMessage = "Date is required.")]
		[DataType(DataType.Date, ErrorMessage = "Date must be a valid date.")]
		public DateTime Date { get; set; }

		[Required(ErrorMessage = "Description is required.")]
		[StringLength(255, MinimumLength = 3, ErrorMessage = "Description must be between 3 and 255 characters.")]
		public string Description { get; set; }

		public long UserId { get; set; }
		[ForeignKey("UserId")]
		public virtual User User { get; set; }

		public Guid EventId { get; set; }
		[ForeignKey("EventId")]
		public virtual Event Event { get; set; }

	}
}

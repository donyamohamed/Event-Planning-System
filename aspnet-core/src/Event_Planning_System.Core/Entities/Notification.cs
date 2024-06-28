using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum Notification_Type
{
    UpComming,
    AskForInvitation,
    Updated,
    Other
}

public enum Notification_Status
{
    Pending,
    Accepted,
    Rejected,
}

namespace Event_Planning_System.Enitities
{
    public class notification : Entity<int>
    {
        [Required(ErrorMessage = "Content is required.")]
        public string Content { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.DateTime, ErrorMessage = "Date must be a valid datetime.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Notification type is required.")]
        public Notification_Type NType { get; set; }

        public bool isRead { get; set; }

        public Notification_Status status { get; set; }

        public bool IsReviewTaken { get; set; } = false;

        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public long GuestId { get; set; }

        [ForeignKey("GuestId")]
        public virtual User Guest { get; set; }

        public int EventId { get; set; }

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }
    }
}

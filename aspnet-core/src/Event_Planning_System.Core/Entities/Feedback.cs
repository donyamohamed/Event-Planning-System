using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Event_Planning_System.Entities
{
    public class Feedback : IEntity<int>
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Body is required.")]
        [StringLength(300, ErrorMessage = "Body cannot be longer than 300 characters.")]
        public string Body { get; set; }

        [Required(ErrorMessage = "EventId is required.")]
        public int EventId { get; set; }

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }

        [Required(ErrorMessage = "UserId is required.")]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required(ErrorMessage = "Rate is required.")]
        [Range(0.5, 5.0, ErrorMessage = "Rate must be between 1.0 and 5.0.")]
        public float Rate { get; set; }
        
        public DateTime DateTime { get; set; }

        public bool IsTransient()
        {
            return ((IEntity<int>)Event).IsTransient();
        }
    }
}

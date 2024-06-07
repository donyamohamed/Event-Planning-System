using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace Event_Planning_System.ToDoCheckList.Dto
{
    public class ToDoListDto: IEntityDto<int>
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Status is required.")]
        public string Status { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date, ErrorMessage = "Date must be a valid date.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(255, MinimumLength = 3, ErrorMessage = "Description must be between 3 and 255 characters.")]
        public string Description { get; set; }

        public long UserId { get; set; }

        public int EventId { get; set; }
        
    }
}

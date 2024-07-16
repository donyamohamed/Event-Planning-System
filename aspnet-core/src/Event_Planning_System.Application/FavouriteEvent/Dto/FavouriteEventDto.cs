using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.FavouriteEvent.Dto
{
    public class FavouriteEventDto : IEntityDto<int>
    {
        public int Id { get; set; }
        public long UserId { get; set; }
        public int EventId { get; set; }
       
    }

}

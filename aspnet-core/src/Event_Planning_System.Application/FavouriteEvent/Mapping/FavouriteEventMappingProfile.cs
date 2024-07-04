using AutoMapper;
using Event_Planning_System.FavouriteEvent.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.FavouriteEvent.Mapping
{
    public class FavouriteEventMappingProfile :Profile
    {
        public FavouriteEventMappingProfile()
        {
            CreateMap<Entities.FavoriteEvent, FavouriteEventDto>();
            CreateMap<FavouriteEventDto, Entities.FavoriteEvent>();
        }
    }
}

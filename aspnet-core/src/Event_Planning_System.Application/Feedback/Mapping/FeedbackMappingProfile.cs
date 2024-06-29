using AutoMapper;
using Event_Planning_System.Entities;
using Event_Planning_System.Feedback.Dto;

namespace Event_Planning_System.Feedback.Mapping
{
    public class FeedbackMappingProfile : Profile
    {
        public FeedbackMappingProfile()
        {
            CreateMap<Entities.Feedback, FeedbackDto>();
            CreateMap<FeedbackDto, Entities.Feedback > ();
        }
    }
}

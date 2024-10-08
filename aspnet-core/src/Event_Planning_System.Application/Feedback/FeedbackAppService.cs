﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Entities;
using Event_Planning_System.Feedback.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Feedback
{
    public class FeedbackAppService : AsyncCrudAppService<Entities.Feedback, FeedbackDto, int>, IFeedbackAppService
    {
        private readonly IRepository<Entities.Feedback, int> _repository;
        private readonly IMapper _mapper;

        public FeedbackAppService(
            IRepository<Entities.Feedback, int> repository,
            IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<FeedbackDto>> GetFeedbackByEventId(int eventId)
        {
            var feedbacks = await _repository.GetAllListAsync(f => f.EventId == eventId);
            return _mapper.Map<List<FeedbackDto>>(feedbacks);
        }


        public async Task<(double averageRating, int numberOfRaters)> GetAverageRating(int eventId)
        {
            var feedbacks = await _repository.GetAllListAsync(f => f.EventId == eventId);

            Console.WriteLine($"Feedback count for eventId {eventId}: {feedbacks.Count}");

            if (feedbacks.Any())
            {
                var averageRating = feedbacks.Average(f => f.Rate);
                var numberOfRaters = feedbacks.Count();

                Console.WriteLine($"Average Rating: {averageRating}");
                Console.WriteLine($"Number of Raters: {numberOfRaters}");

                // Check if the decimal part of averageRating is exactly 0.5
                if (Math.Abs(averageRating - Math.Floor(averageRating)) == 0.5)
                {
                    return (averageRating, numberOfRaters); // Return as is if it's exactly 0.5
                }
                else
                {
                    // Otherwise, round to the nearest whole number
                    var roundedRating = Math.Round(averageRating);
                    return (roundedRating, numberOfRaters);
                }
            }

            return (0.0, 0); // Return 0.0 and 0 if no feedbacks are found for the event
        }





    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Event_Planning_System.Entities
{
    public class ChatbotHub : Hub
    {
        public async Task AskQuestion(string question)
        {
            // Logic to get the answer based on the question
            string answer = GetAnswer(question);
            await Clients.Caller.SendAsync("ReceiveAnswer", answer);
        }
        private string GetAnswer(string question)
        {
            // Dummy answers for demonstration
            return question switch
            {
                "How can our system help streamline your event planning process?" => " Our system helps streamline your event planning process by providing an intuitive platform where you can create, manage, and track events effortlessly.",
                "What features does the system offer for creating event plans?" => " The system offers features for creating detailed event plans, allowing you to outline every aspect of your event comprehensively.",
                "How does the system assist in managing tasks and deadlines?" => " The system helps manage tasks and deadlines by providing tools to organize and track your event-related tasks, ensuring you meet all your deadlines efficiently.",
                "Can I invite guests and track RSVPs through the system?" => " Yes, you can invite guests and track RSVPs through the system, making it easy to manage your guest list and keep track of who will be attending your event.",
                "What customization options are available for event details and settings?" => "The system allows you to customize event details and settings to suit your specific needs, including managing budgets and expenses to keep your event within financial limits.",
                _ => "No answer available."
            };
        }
    }
}

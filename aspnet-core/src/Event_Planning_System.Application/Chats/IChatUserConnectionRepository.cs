using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Enitities;
using Event_Planning_System.Entities;
namespace Event_Planning_System.Chats
{
    public interface IChatUserConnectionRepository : IRepository<ChatUserConnection, long>
    {
        Task<List<string>> GetConnectionIdsByUserIdAsync(long userId);
        Task AddOrUpdateUserConnectionAsync(string userId, string connectionId);
        Task RemoveUserConnectionAsync(string userId, string connectionId);
    }
}

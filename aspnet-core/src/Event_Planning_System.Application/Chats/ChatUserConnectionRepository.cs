using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.Repositories;
using Abp.EntityFrameworkCore;
using Event_Planning_System.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Event_Planning_System.Entities;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Event_Planning_System.Chats
{
    public class ChatUserConnectionRepository : EfCoreRepositoryBase<Event_Planning_SystemDbContext, ChatUserConnection, long>, IChatUserConnectionRepository
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ChatUserConnectionRepository(
            IDbContextProvider<Event_Planning_SystemDbContext> dbContextProvider,
            IUnitOfWorkManager unitOfWorkManager)
            : base(dbContextProvider)
        {
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task AddOrUpdateUserConnectionAsync(string userId, string connectionId)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    var userConnection = await GetAll().FirstOrDefaultAsync(u => u.UserId == userId);
                    if (userConnection == null)
                    {
                        userConnection = new ChatUserConnection { UserId = userId };
                        userConnection.ConnectionId = connectionId;
                        await InsertAsync(userConnection);
                    }
                    else
                    {
                        userConnection.ConnectionId = connectionId;
                        await UpdateAsync(userConnection);
                    }

                    await unitOfWork.CompleteAsync();
                }
                catch (Exception ex)
                {
                    // Handle or log the exception
                    throw new ApplicationException("Error adding or updating user connection", ex);
                }
            }
        }

        public async Task RemoveUserConnectionAsync(string userId, string connectionId)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                var userConnection = await GetAll().FirstOrDefaultAsync(u => u.UserId == userId && u.ConnectionId == connectionId);
                if (userConnection != null)
                {
                    await DeleteAsync(userConnection);
                    await unitOfWork.CompleteAsync();
                }
            }
        }

        public async Task<List<string>> GetConnectionIdsByUserIdAsync(long userId)
        {
            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    var connectionIds = await GetAll()
                        .Where(c => c.UserId == userId.ToString())
                        .Select(c => c.ConnectionId)
                        .ToListAsync();

                    await unitOfWork.CompleteAsync();
                    return connectionIds;
                }
                catch (Exception ex)
                {
                    // Handle or log the exception
                    throw new ApplicationException("Error retrieving connection IDs", ex);
                }
            }
        }
    }
}

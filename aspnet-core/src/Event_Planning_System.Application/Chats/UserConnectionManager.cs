using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public class UserConnectionManager
    {
        private static readonly ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();

        public void AddConnection(string userId, string connectionId)
        {
            _connections[userId] = connectionId;
        }

        public string GetConnectionId(string userId)
        {
            _connections.TryGetValue(userId, out var connectionId);
            return connectionId;
        }

        public void RemoveConnection(string connectionId)
        {
            var item = _connections.FirstOrDefault(kvp => kvp.Value == connectionId);
            if (item.Key != null)
            {
                _connections.TryRemove(item.Key, out _);
            }
        }
    }
}

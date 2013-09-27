using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CollidR.Sample
{
    // original version written by Tom FitzMacken from the Web Platform & Tools Content team at Microsoft
    // based on the code from http://www.asp.net/signalr/overview/hubs-api/mapping-users-to-connections
    // modified to track connections on a specific model

    public class ModelConnectionMapping<T>
    {
        private readonly Dictionary<T, HashSet<string>> _connections = new Dictionary<T, HashSet<string>>();

        public int Count
        {
            get { return _connections.Count; }
        }

        /// <summary>
        /// Adds the name of a user to a group
        /// </summary>
        /// <param name="groupName">The unique group name</param>
        /// <param name="username">The name of the user</param>
        public void Add(T groupName, string username)
        {
            lock (_connections)
            {
                HashSet<string> connections;
                if (!_connections.TryGetValue(groupName, out connections))
                {
                    connections = new HashSet<string>();
                    _connections.Add(groupName, connections);
                }

                lock (connections)
                {
                    connections.Add(username);
                }
            }
        }

        /// <summary>
        /// Gets the connections for the specified group
        /// </summary>
        /// <param name="groupName">The name of the group to fetch the users for</param>
        /// <returns>An enumerable containing the connected usernames</returns>
        public IEnumerable<string> GetConnections(T groupName)
        {
            HashSet<string> connections;
            if (_connections.TryGetValue(groupName, out connections))
                return connections;

            return Enumerable.Empty<string>();
        }

        /// <summary>
        /// Removes a user from a group
        /// </summary>
        /// <param name="groupName">The name of the group</param>
        /// <param name="username">The user to remove</param>
        public void Remove(T groupName, string username)
        {
            lock (_connections)
            {
                HashSet<string> connections;
                if (!_connections.TryGetValue(groupName, out connections))
                    return;

                lock (connections)
                {
                    connections.Remove(username);

                    if (connections.Count == 0)
                        _connections.Remove(groupName);
                }
            }
        }

        /// <summary>
        /// Removes a user from all groups and returns a list of the groups the user was in
        /// </summary>
        /// <param name="username">The user to clear</param>
        /// <returns>The list of groups the user was in</returns>
        public IEnumerable<T> ClearUser(string username)
        {
            HashSet<T> groups = new HashSet<T>();
            lock (_connections)
            {
                foreach (var key in _connections.Keys)
                {
                    if (_connections[key].Remove(username))
                    {
                        groups.Add(key);
                    }                        
                }
            }

            return groups;

        }

        public IEnumerable<T> GetActiveModels()
        {
            return _connections.Keys;
        }

    }

}
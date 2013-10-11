using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using System.Runtime.Remoting.Contexts;
using Microsoft.AspNet.SignalR.Hubs;

namespace CollidR
{
    [Authorize]
    [HubName("CollidRHub")]
    public class EntityEditorHub : Hub
    {
        private readonly static ModelConnectionMapping<string> _connections = new ModelConnectionMapping<string>();

        public async Task JoinModel(string modelId, string modelType)
        {
            var groupTag = GenerateGroupTag(modelId, modelType);
            var username = Context.User.Identity.Name;

            // add the user to the group and track them in the list of connections
            await Groups.Add(Context.ConnectionId, groupTag);
            _connections.Add(groupTag, username);

            // send the list of editors to all in the group
            var users = _connections.GetConnections(groupTag);
            Clients.Group(groupTag).updateEditorList(string.Join(", ", users));
            Clients.Group(groupTag).editorConnected(username);

        }

        public void EnterField(string fieldName, string modelId, string modelType)
        {
            var groupTag = GenerateGroupTag(modelId, modelType);
            var username = Context.User.Identity.Name;

            Clients.OthersInGroup(groupTag).enterField(username, fieldName);

        }

        public void ExitField(string fieldName, string modelId, string modelType)
        {
            var groupTag = GenerateGroupTag(modelId, modelType);
            var username = Context.User.Identity.Name;

            Clients.OthersInGroup(groupTag).ExitField(username, fieldName);

        }

        public void ModifyField(string fieldName, string modelId, string modelType, string newValue)
        {
            var groupTag = GenerateGroupTag(modelId, modelType);
            var username = Context.User.Identity.Name;

            Clients.OthersInGroup(groupTag).modifyField(username, fieldName, newValue);
        }

        public void SaveModel(string modelId, string modelType)
        {
            var groupTag = GenerateGroupTag(modelId, modelType);
            var username = Context.User.Identity.Name;

            Clients.OthersInGroup(groupTag).saveModel(username);
        }

        public override Task OnDisconnected()
        {
            var username = Context.User.Identity.Name;
            var groups = _connections.ClearUser(username);

            // notify any groups the user was in
            foreach (var groupTag in groups)
            {
                var users = _connections.GetConnections(groupTag);
                Clients.Group(groupTag).updateEditorList(string.Join(", ", users));
                Clients.Group(groupTag).editorDisconnected(username);
            }

            return base.OnDisconnected();
        }

        private static string GenerateGroupTag(string modelId, string modelType)
        {
            var groupTag = string.Format("{0}|{1}", modelType, modelId);
            return groupTag;
        }
        
    }
}

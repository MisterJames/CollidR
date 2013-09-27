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

        public async Task JoinModel(int modelId, string modelType)
        {
            var groupTag = string.Format("{0}|{1}", modelType, modelId);
            var username = HttpContext.Current.User.Identity.Name;

            // add the user to the group and track them in the list of connections
            await Groups.Add(Context.ConnectionId, groupTag);
            _connections.Add(groupTag, username);

            // send the list of editors to all in the group
            var users = _connections.GetConnections(groupTag);
            Clients.Group(groupTag).updateEditorList(string.Join(", ", users));
            Clients.Group(groupTag).editorConnected(username);

        }

        public void EnterField(string fieldName, int modelId, string modelType)
        {
            var groupTag = string.Format("{0}|{1}", modelType, modelId);
            var username = HttpContext.Current.User.Identity.Name;

            Clients.OthersInGroup(groupTag).enterField(username, fieldName);

        }

        public void ExitField(string fieldName, int modelId, string modelType)
        {
            var groupTag = string.Format("{0}|{1}", modelType, modelId);
            var username = HttpContext.Current.User.Identity.Name;

            Clients.OthersInGroup(groupTag).ExitField(username, fieldName);

        }

        public void ModifyField(string fieldName, int modelId, string modelType)
        {
            var groupTag = string.Format("{0}|{1}", modelType, modelId);
            var username = HttpContext.Current.User.Identity.Name;

            Clients.OthersInGroup(groupTag).modifyField(username, fieldName);
        }

        public override Task OnDisconnected()
        {
            var username = HttpContext.Current.User.Identity.Name;
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


    }
}

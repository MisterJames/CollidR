using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(CollidR.Sample.App_Start.CollidRStartup), "Start")]

namespace CollidR.Sample.App_Start
{
    public static class CollidRStartup
    {
        public static void Start()
        {
            RouteTable.Routes.MapHubs();
        }
    }
}
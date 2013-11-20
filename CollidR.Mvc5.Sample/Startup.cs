using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CollidR.Mvc5.Sample.Startup))]
namespace CollidR.Mvc5.Sample
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}

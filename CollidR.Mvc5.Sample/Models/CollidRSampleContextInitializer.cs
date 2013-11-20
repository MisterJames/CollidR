using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace CollidR.Mvc5.Sample.Models
{
    public class CollidRSampleContextInitializer : DropCreateDatabaseIfModelChanges<CollidRSampleContext>
    {
        protected override void Seed(CollidRSampleContext context)
        {
            context.People.Add(new Person { FirstName = "D'Arcy", LastName = "Lussier" });
            context.People.Add(new Person { FirstName = "Jimmy", LastName = "Hendrix" });
            context.People.Add(new Person { FirstName = "George", LastName = "Straight" });

            base.Seed(context);
        }
    }
}
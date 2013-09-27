using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CollidR.Sample.Models
{
    public class Person
    {
        public int PersonId { get; set; }

        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

    }
}
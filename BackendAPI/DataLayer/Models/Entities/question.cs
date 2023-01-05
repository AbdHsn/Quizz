using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models.Entities
{
    public class questions
    {
        public int? id { get; set; }
        public string? question { get; set; }
        public string? topic { get; set; }
        public string? options { get; set; }
        public string? correct_option { get; set; }
        public int? time_in_minutes { get; set; }
        
        [NotMapped]
        public string? selected_option { get; set; }
    }

    public class options
    {
        public string option { get; set; }
        public bool? is_correct { get; set; }

    }
}

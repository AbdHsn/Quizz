using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Models.Entities
{
    public class answer
    {
        public int id { get; set; }
        public int? user_id { get; set; }
        public int? question_id { get; set; }
        public string? selected_option { get; set; }
        public bool? is_correct { get; set; }
        public string? quiz_reference { get; set; }
    }
}

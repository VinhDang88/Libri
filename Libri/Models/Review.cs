using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class Review
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Isbn { get; set; }
        public string? BookTitle { get; set; }
        public string? Author { get; set; }
        public string? UserName { get; set; }
        public string? Review1 { get; set; }
        public DateTime? DatePosted { get; set; }
        public int? Votes { get; set; }

        public virtual User? User { get; set; }
    }
}

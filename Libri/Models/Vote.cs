using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class Vote
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int PostId { get; set; }
        public bool? Upvoted { get; set; }
        public bool? Downvoted { get; set; }

        public virtual User? User { get; set; }
    }
}

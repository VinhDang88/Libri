using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class Follower
    {
        public int Id { get; set; }
        public string? UserFollowedId { get; set; }
        public string? UserFollowingId { get; set; }

        public virtual User? UserFollowed { get; set; }
    }
}

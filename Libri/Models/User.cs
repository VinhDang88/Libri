using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class User
    {
        public User()
        {
            FavoriteLists = new HashSet<FavoriteList>();
        }

        public string Id { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Name { get; set; }
        public string? PhotoUrl { get; set; }

        public virtual ICollection<FavoriteList> FavoriteLists { get; set; }
    }
}

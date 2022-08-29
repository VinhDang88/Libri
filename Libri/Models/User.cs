using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class User
    {
        public User()
        {
            DeniedLists = new HashSet<DeniedList>();
            FavoriteLists = new HashSet<FavoriteList>();
            ReadLists = new HashSet<ReadList>();
            WishLists = new HashSet<WishList>();
        }

        public string Id { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Name { get; set; }
        public string? PhotoUrl { get; set; }

        public virtual ICollection<DeniedList> DeniedLists { get; set; }
        public virtual ICollection<FavoriteList> FavoriteLists { get; set; }
        public virtual ICollection<ReadList> ReadLists { get; set; }
        public virtual ICollection<WishList> WishLists { get; set; }
    }
}

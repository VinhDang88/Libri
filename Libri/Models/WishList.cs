using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class WishList
    {
        public string? WishListId { get; set; }
        public string? Isbn { get; set; }

        public virtual User? WishListNavigation { get; set; }
    }
}

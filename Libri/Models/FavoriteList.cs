using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class FavoriteList
    {
        public int Id { get; set; }
        public string? FavoriteListId { get; set; }
        public string? Isbn { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Subject { get; set; }
        public float? AverageRating { get; set; }
        public int? RatingsCount { get; set; }

        public virtual User? FavoriteListNavigation { get; set; }
    }
}

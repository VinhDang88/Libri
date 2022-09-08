using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class UserReccomendation
    {
        public int Id { get; set; }
        public string? ReccomendedTo { get; set; }
        public string? RecomendedBy { get; set; }
        public string? Isbn { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Subject { get; set; }
        public float? AverageRating { get; set; }
        public int? RatingsCount { get; set; }
        public string? BookThumbnailUrl { get; set; }
        public string? Description { get; set; }

        public virtual User? ReccomendedToNavigation { get; set; }
    }
}

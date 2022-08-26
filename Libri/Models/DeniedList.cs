using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class DeniedList
    {
        public string? DeniedListId { get; set; }
        public string? Isbn { get; set; }

        public virtual User? DeniedListNavigation { get; set; }
    }
}

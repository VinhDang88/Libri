using System;
using System.Collections.Generic;

namespace Libri.Models
{
    public partial class ReadList
    {
        public string? ReadListId { get; set; }
        public string? Isbn { get; set; }

        public virtual User? ReadListNavigation { get; set; }
    }
}

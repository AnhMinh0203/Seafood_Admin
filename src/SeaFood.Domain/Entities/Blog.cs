using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Blog: AuditedEntity<int>
    {
        public string Title { get; set; }
        public string Summary { get; set; }
        public string CoverImage { get; set; }
        public string Content { get; set; }
        public int View { get; set; } = 0;

    }
}

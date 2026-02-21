using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Category: AuditedEntity<int>
    {
        public string Name { get; set; }
    }
}

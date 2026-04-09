using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Favorite : AuditedEntity<Guid>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}

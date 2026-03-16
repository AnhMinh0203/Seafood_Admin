using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Product: AuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string? Origin { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string? CoverImage { get; set; }
        public string? Slug { get; set; }
        public List<ProductUnit>? Units { get; set; }
        public List<ProductImage>? Images { get; set; }
    }
}

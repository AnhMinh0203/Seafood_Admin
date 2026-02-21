using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace SeaFood.Entities
{
    public class ProductImage: Entity<int>
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
        public Product Product { get; set; }
    }
}

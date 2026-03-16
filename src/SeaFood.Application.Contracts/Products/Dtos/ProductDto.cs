using SeaFood.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Products.Dtos
{
    public class ProductDto: EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Origin { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CoverImage { get; set; }
        public string Slug { get; set; }
        public List<ProductUnitDto> Units { get; set; }
        public List<ProductImageDto> Images { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Products.Dtos
{
    public class ProductCardDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Origin { get; set; }
        public string CoverImage { get; set; }
        public string Slug { get; set; }
        public decimal? DefaultPrice { get; set; }
        public string? DefaultUnitName { get; set; }
    }
}

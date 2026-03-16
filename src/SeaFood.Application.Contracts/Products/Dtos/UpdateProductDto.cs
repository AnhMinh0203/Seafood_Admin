using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace SeaFood.Products.Dtos
{
    public class UpdateProductDto
    {
        public Guid ProductId { get; set; }
        public string? Name { get; set; }
        public IRemoteStreamContent? CoverImage { get; set; }
        public string? Origin { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public int CategoryId { get; set; }
        public List<ProductUnitDto>? Units { get; set; }
    }
}

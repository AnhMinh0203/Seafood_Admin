using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Products.Dtos
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public IFormFile CoverImage { get; set; }
        public string? Origin { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public List<ProductUnitDto>? Units { get; set; }
        public List<ProductImageDto>? ChildImages { get; set; }
    }
}

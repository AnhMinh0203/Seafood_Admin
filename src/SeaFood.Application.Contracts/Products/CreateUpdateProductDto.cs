using Microsoft.AspNetCore.Http;
using SeaFood.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Products
{
    public class CreateUpdateProductDto
    {
        public int? ProductId { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Origin { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public IFormFile CoverImage { get; set; }
        public List<ProductUnit>? Units { get; set; }
        public List<ProductImageDto>? ChildImages { get; set; }
        public List<IFormFile>? ChildImageFiles { get; set; }

    }
}

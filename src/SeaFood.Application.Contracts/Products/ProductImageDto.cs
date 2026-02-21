using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Products
{
    public class ProductImageDto
    {
        public int ProductId { get; set; }
        public IFormFile ChildImage { get; set; }
        public string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}

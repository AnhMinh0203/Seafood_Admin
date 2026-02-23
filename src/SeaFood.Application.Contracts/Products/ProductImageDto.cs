using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace SeaFood.Products
{
    public class ProductImageDto
    {
        public int ProductId { get; set; }
        public IRemoteStreamContent ChildImage { get; set; }
        public string ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}

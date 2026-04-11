using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Favorites.Dtos
{
    public class FavoriteProductDto
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; }
        public string? CoverImage { get; set; }
        public string? Origin { get; set; }
        public string? Slug { get; set; }

        public decimal Price { get; set; }
        public string Unit { get; set; }
    }
}

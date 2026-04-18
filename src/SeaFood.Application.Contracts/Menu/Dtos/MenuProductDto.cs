using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Menu.Dtos
{
    public class MenuProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string? CoverImage { get; set; }
        public string? Slug { get; set; }
        public string CategoryKey { get; set; } = default!;
    }
}

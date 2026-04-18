using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Menu.Dtos
{
    public class MenuCategoryDto
    {
        public string Key { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? SubLabel { get; set; }
        public string? Icon { get; set; }
        public int SortOrder { get; set; }
        public List<MenuProductDto> Products { get; set; } = new();
    }
}

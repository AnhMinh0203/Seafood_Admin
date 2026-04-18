using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Menu.Dtos
{
    public class MenuPageDto
    {
        public List<MenuCategoryDto> Categories { get; set; } = new();
    }
}

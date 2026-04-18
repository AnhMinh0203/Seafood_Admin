using SeaFood.Menu.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Menu
{
    public interface IMenuAppService
    {
        Task<MenuPageDto> GetMenuAsync();
    }
}

using Microsoft.AspNetCore.Mvc;
using SeaFood.Favorites;
using SeaFood.Menu;
using SeaFood.Menu.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/menu")]
    [IgnoreAntiforgeryToken]
    public class MenuController: SeaFoodController
    {
        private readonly IMenuAppService _menuAppService;
        public MenuController(IMenuAppService menuAppService)
        {
            _menuAppService = menuAppService;
        }

        [HttpGet("get-menu")]
        public async Task<MenuPageDto> GetMenu()
        {
            return await _menuAppService.GetMenuAsync();
        }
    }
}

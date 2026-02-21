using Microsoft.AspNetCore.Mvc;
using SeaFood.Categories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/category")]
    public class CategoryController: SeaFoodController
    {
        private readonly ICategoryAppService _categoryAppService;
        public CategoryController(ICategoryAppService categoryAppService)
        {
            _categoryAppService = categoryAppService;
        }

        [HttpGet("getList")]
        public async Task<ActionResult> GetList()
        {
            var res = await _categoryAppService.GetListAsync();
            return Ok(res);
        }

    }
}

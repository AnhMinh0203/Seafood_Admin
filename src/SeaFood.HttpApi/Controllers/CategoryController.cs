using Microsoft.AspNetCore.Mvc;
using SeaFood.Categories;
using SeaFood.Categories.Dtos;
using SeaFood.Utils;
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
        public async Task<PagedResultDto<CategoryDto>> GetList([FromQuery] PagedAndSortedResultRequestDto input)
        {
            return await _categoryAppService.GetListAsync(input);
        }

        [HttpPost("create")]
        public async Task<CategoryDto> Create([FromBody] CreateCategoryDto input)
        {
            return await _categoryAppService.CreateAsync(input);
        }

        [HttpPut("update/{id}")]
        public async Task<CategoryDto> Update(int id, [FromBody] UpdateCategoryDto input)
        {
            return await _categoryAppService.UpdateAsync(id, input);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<BaseResponse<bool>> Delete( int id)
        {
            return await _categoryAppService.DeleteCategoryAsync(id);
        }

        [HttpDelete("BatchDelete")]
        public async Task<BaseResponse<bool>> BatchDelete([FromBody] List<int> ids)
        {
            return await _categoryAppService.BatchDeleteCategoriesAsync(ids);
        }
    }
}

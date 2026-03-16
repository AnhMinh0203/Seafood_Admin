using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Categories
{
    public interface ICategoryAppService
    {
        Task<PagedResultDto<CategoryDto>> GetListAsync(PagedAndSortedResultRequestDto input);
        Task<CategoryDto> CreateAsync(CreateCategoryDto input);
        Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto input);
        Task<BaseResponse<bool>> BatchDeleteCategoriesAsync(List<int> ids);
        Task<BaseResponse<bool>> DeleteCategoryAsync(int id);
    }
}

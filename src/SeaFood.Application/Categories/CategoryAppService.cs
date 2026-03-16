using Microsoft.EntityFrameworkCore;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.EntityFrameworkCore;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace SeaFood.Categories
{
    public class CategoryAppService: ApplicationService, ICategoryAppService
    {
        private readonly IRepository<Category, int> _categoryRepository;
        private readonly IRepository<Product, Guid> _productRepository;

        public CategoryAppService(IRepository<Category, int> categoryRepository, IRepository<Product, Guid> productRepository)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
        }

        public async Task<PagedResultDto<CategoryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var categoryQueryable = await _categoryRepository.GetQueryableAsync();
            var productQueryable = await _productRepository.GetQueryableAsync();

            var query =
                from category in categoryQueryable
                join product in productQueryable
                    on category.Id equals product.CategoryId into products
                select new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    ProductCount = products.Count()
                };

            var totalCount = await AsyncExecuter.CountAsync(query);

            var items = await AsyncExecuter.ToListAsync(
                query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
            );

            return new PagedResultDto<CategoryDto>(totalCount, items);
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto input)
        {
            var category = new Category
            {
                Name = input.Name
            };

            category = await _categoryRepository.InsertAsync(category, autoSave: true);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ProductCount = 0
            };
        }

        public async Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto input)
        {
            var category = await _categoryRepository.GetAsync(id);

            category.Name = input.Name;

            await _categoryRepository.UpdateAsync(category, autoSave: true);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task<BaseResponse<bool>> DeleteCategoryAsync(int id)
        {
            var isUsed = await _productRepository.AnyAsync(p => p.CategoryId == id);
            if (isUsed) return new BaseResponse<bool>(false, 400, "Không thể xóa danh mục đang chứa sản phẩm", false);
            await _categoryRepository.DeleteAsync(id);

            return new BaseResponse<bool>(true, 200,"Xóa danh mục thành công", true);
        }

        public async Task<BaseResponse<bool>> BatchDeleteCategoriesAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                throw new UserFriendlyException("Danh sách danh mục không hợp lệ");

            var isUsed = await _productRepository.AnyAsync(p => ids.Contains(p.CategoryId));
            if (isUsed) return new BaseResponse<bool>(false, 400, "Không thể xóa danh mục đang chứa sản phẩm", false);
            await _categoryRepository.DeleteAsync(x => ids.Contains(x.Id), autoSave: true);

            return new BaseResponse<bool>(true, 200, "Xóa danh mục thành công ^^", true);
        }
    }
}

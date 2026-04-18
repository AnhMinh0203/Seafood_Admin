using SeaFood.Entities;
using SeaFood.Menu.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace SeaFood.Menu
{
    public class MenuAppService : ApplicationService, IMenuAppService
    {
        private readonly IRepository<Category, int> _categoryRepository;
        private readonly IRepository<Product, Guid> _productRepository;

        public MenuAppService(
            IRepository<Category, int> categoryRepository,
            IRepository<Product, Guid> productRepository)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
        }
        public async Task<MenuPageDto> GetMenuAsync()
        {
            var categories = await _categoryRepository.GetListAsync();
            var products = await _productRepository.GetListAsync();

            var productLookup = products.ToLookup(x => x.CategoryId);

            var categoryDtos = categories
                .OrderBy(x => x.SortOrder)
                .Select(category => new MenuCategoryDto
                {
                    Key = category.Key,
                    Name = category.Name,
                    SubLabel = category.SubLabel,
                    Icon = category.Icon,
                    SortOrder = category.SortOrder,
                    Products = productLookup[category.Id]
                        .OrderBy(product => product.Name)
                        .Select(product => new MenuProductDto
                        {
                            Id = product.Id,
                            Name = product.Name,
                            Description = product.Description,
                            CoverImage = product.CoverImage,
                            Slug = product.Slug,
                            CategoryKey = category.Key
                        })
                        .ToList()
                })
                .ToList();

            var allProducts = categoryDtos
                .SelectMany(x => x.Products)
                .ToList();

            if (!categoryDtos.Any(x => x.Key == "all"))
            {
                categoryDtos.Insert(0, new MenuCategoryDto
                {
                    Key = "all",
                    Name = "Tất cả",
                    SubLabel = "Danh mục",
                    Icon = "fa fa-border-all",
                    SortOrder = 0,
                    Products = allProducts
                });
            }

            return new MenuPageDto
            {
                Categories = categoryDtos
            };
        }
    }
}

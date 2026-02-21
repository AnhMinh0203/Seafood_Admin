using Microsoft.EntityFrameworkCore;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace SeaFood.Categories
{
    public class CategoryAppService: ApplicationService, ICategoryAppService
    {
        private readonly IRepository<Category, int> _categoryRepository;
        public CategoryAppService(IRepository<Category, int> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<CategoryDto>> GetListAsync()
        {
            var queryable = await _categoryRepository.GetQueryableAsync();

            return await queryable
                .Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();
        }
    }
}

using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Categories
{
    public interface ICategoryAppService
    {
        Task<List<CategoryDto>> GetListAsync();
    }
}

using SeaFood.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace SeaFood.Blogs
{
    public class BlogAppService: ApplicationService, IBlogAppService
    {
        //private readonly IRepository<Category, int> _categoryRepository;
        public BlogAppService()
        {
            
        }
    }
}

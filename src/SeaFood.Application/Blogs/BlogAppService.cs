using SeaFood.Blogs.Dtos;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.Products.Dtos;
using SeaFood.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;

namespace SeaFood.Blogs
{
    public class BlogAppService: ApplicationService, IBlogAppService
    {
        private readonly IRepository <Blog,int> _blogRepository;
        private readonly IFileStorageService _fileService;
        public BlogAppService(IRepository<Blog, int> blogRepository, IFileStorageService fileStorageService)
        {
            _blogRepository = blogRepository;
            _fileService = fileStorageService;
        }

        public async Task<PagedResultDto<BlogDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await _blogRepository.GetQueryableAsync();               
            var totalCount = await AsyncExecuter.CountAsync(query);

            if (!input.Sorting.IsNullOrWhiteSpace())
            {
                query = query.OrderBy(input.Sorting);
            }
            else
            {
                query = query.OrderByDescending(p => p.Id);
            }

            var entities = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));
            var items = ObjectMapper.Map<List<Blog>, List<BlogDto>>(entities);
            return new PagedResultDto<BlogDto>(totalCount, items);
        }
    }
}

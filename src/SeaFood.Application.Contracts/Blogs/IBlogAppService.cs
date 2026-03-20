using SeaFood.Blogs.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Blogs
{
    public interface IBlogAppService
    {
        Task<PagedResultDto<BlogDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    }
}

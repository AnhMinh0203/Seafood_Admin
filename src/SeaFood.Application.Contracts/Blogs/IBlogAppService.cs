using SeaFood.Blogs.Dtos;
using SeaFood.Utils;
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
        Task<BlogDto> GetDetailAsync(int id);
        Task<BaseResponse<BlogDto>> CreateBlogAsync(CreateBlogDto input);
        Task<BaseResponse<BlogDto>> UpdateBlogAsync(int iteamId, UpdateBlogDto input);
    }
}

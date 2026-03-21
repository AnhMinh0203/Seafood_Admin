using Microsoft.AspNetCore.Mvc;
using SeaFood.Blogs;
using SeaFood.Blogs.Dtos;
using SeaFood.Products.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Content;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/blog")]
    [RemoteService(Name = "Blog")]
    public class BlogController: SeaFoodController
    {
        private readonly IBlogAppService _blogAppService;
        public BlogController(IBlogAppService blogAppService)
        {
            _blogAppService = blogAppService;
        }

        [HttpGet("getList")]
        public async Task<PagedResultDto<BlogDto>> GetList([FromQuery] PagedAndSortedResultRequestDto input)
        {
            return await _blogAppService.GetListAsync(input);
        }

        [HttpGet("getDetail")]
        public async Task<BlogDto> GetBlogById(int iteamId)
        {
            return await _blogAppService.GetDetailAsync(iteamId);
        }

        [HttpPost("Create")]
        public async Task<BaseResponse<BlogDto>> Create([FromForm] CreateBlogDto input)
        {
            return await _blogAppService.CreateBlogAsync(input);
        }

        [HttpPut("Update/{id}")]
        public async Task<BaseResponse<BlogDto>> Update(int id, [FromForm] UpdateBlogDto input)
        {
            return await _blogAppService.UpdateBlogAsync(id, input);
        }
    }
}

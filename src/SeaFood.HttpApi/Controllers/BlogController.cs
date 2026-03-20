using Microsoft.AspNetCore.Mvc;
using SeaFood.Blogs;
using SeaFood.Blogs.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

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
    }
}

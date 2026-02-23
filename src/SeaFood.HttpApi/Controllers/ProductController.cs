using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using SeaFood.Products;
using SeaFood.Products.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/product")]
    public class ProductController : SeaFoodController
    {
        private readonly IProductAppService _productAppService;
        public ProductController(IProductAppService productAppService)
        {
            _productAppService = productAppService;
        }

        [HttpGet("GetListWithUnits")]
        public async Task<PagedResultDto<ProductDto>> GetListWithUnits([FromQuery] PagedAndSortedResultRequestDto input)
        {
            return await _productAppService.GetListWithUnitsAsync(input);
        }

        [HttpPost("Create")]
        public async Task<BaseResponse<ProductDto>> Create( CreateProductDto input)
        {
            return await _productAppService.CreateProductAsync(input);
        }
    }
}

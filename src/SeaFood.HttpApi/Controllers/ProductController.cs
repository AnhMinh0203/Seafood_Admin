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
        public async Task<ActionResult> GetListWithUnits([FromQuery] PagedAndSortedResultRequestDto input)
        {
            var res = await _productAppService.GetListWithUnitsAsync(input);
            return Ok(res);
        }

        [HttpPost("Create")]
        public async Task<ActionResult> Create( CreateProductDto input)
        {
            var res = await _productAppService.CreateProductAsync(input);
            return Ok(res);
        }
    }
}

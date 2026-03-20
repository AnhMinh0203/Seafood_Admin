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
using Volo.Abp.Content;

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
        public async Task<BaseResponse<ProductDto>> Create([FromForm] CreateProductDto input, [FromForm] List<IRemoteStreamContent> childImages)
        {
            return await _productAppService.CreateProductAsync(input, childImages);
        }

        [HttpPut("Update/{id}")]
        public async Task<BaseResponse<ProductDto>> Update(
            Guid id,
            [FromForm] UpdateProductDto input,
            [FromForm] List<IRemoteStreamContent>? childImages)
        {
            return await _productAppService.UpdateProductAsync(id, input, childImages);
        }

        [HttpGet("GetDetail")]
        public async Task<ProductDto> GetProductById(Guid productId)
        {
            return await _productAppService.GetDetailAsync(productId);
        }

        [HttpDelete("{id}")]
        public async Task<BaseResponse<bool>> Delete(Guid id)
        {
            return await _productAppService.DeleteProductAsync(id);
        }

        [HttpDelete("BatchDelete")]
        public async Task<BaseResponse<bool>> BatchDelete([FromBody] List<Guid> ids)
        {
            return await _productAppService.BatchDeleteProductsAsync(ids);
        }
    }
}

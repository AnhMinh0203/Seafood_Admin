using SeaFood.Products.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace SeaFood.Products
{
    public interface IProductAppService
    {
        Task<PagedResultDto<ProductDto>> GetListWithUnitsAsync(PagedAndSortedResultRequestDto input);
        //Task<string> CreateOrUpdateAsync(CreateUpdateProductDto input);
        Task<BaseResponse<ProductDto>> CreateProductAsync(CreateProductDto input, List<IRemoteStreamContent> childImages);
        Task<ProductDto> GetDetailAsync(Guid id);
        Task<BaseResponse<ProductDto>> UpdateProductAsync(
            Guid id,
            UpdateProductDto input,
            List<IRemoteStreamContent>? childImages);

        Task<BaseResponse<bool>> DeleteProductAsync(Guid id);
        Task<BaseResponse<bool>> BatchDeleteProductsAsync(List<Guid> ids);
    }
}

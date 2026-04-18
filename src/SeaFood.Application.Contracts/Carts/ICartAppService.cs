using SeaFood.Carts.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Carts
{
    public interface ICartAppService
    {
        Task<BaseResponse<CartItemDto>> AddToCartAsync(AddToCartDto input);
        Task<BaseResponse<CartSummaryDto>> GetMyCartAsync();
        Task<BaseResponse<CartItemDto>> UpdateQuantityAsync(UpdateCartQuantityDto input);
        Task<BaseResponse<bool>> RemoveItemAsync(Guid cartId);
        Task<BaseResponse<bool>> ClearMyCartAsync();


    }
}

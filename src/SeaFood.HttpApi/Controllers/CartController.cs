using Microsoft.AspNetCore.Mvc;
using SeaFood.Carts;
using SeaFood.Carts.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/cart")]
    [IgnoreAntiforgeryToken]

    public class CartController: SeaFoodController
    {
        private readonly ICartAppService _cartAppService;

        public CartController(ICartAppService cartAppService)
        {
            _cartAppService = cartAppService;
        }

        [HttpPost("add")]
        public async Task<BaseResponse<CartItemDto>> AddToCartAsync(AddToCartDto input)
        {
            return await _cartAppService.AddToCartAsync(input);
        }

        [HttpGet("my-cart")]
        public async Task<BaseResponse<CartSummaryDto>> GetMyCartAsync()
        {
            return await _cartAppService.GetMyCartAsync();
        }

        [HttpPut("update-quantity")]
        public async Task<BaseResponse<CartItemDto>> UpdateQuantityAsync(UpdateCartQuantityDto input)
        {
            return await _cartAppService.UpdateQuantityAsync(input);
        }

        [HttpDelete("remove/{cartId}")]
        public async Task<BaseResponse<bool>> RemoveItemAsync(Guid cartId)
        {
            return await _cartAppService.RemoveItemAsync(cartId);
        }

        [HttpDelete("clear")]
        public async Task<BaseResponse<bool>> ClearMyCartAsync()
        {
            return await _cartAppService.ClearMyCartAsync();
        }
    }
}

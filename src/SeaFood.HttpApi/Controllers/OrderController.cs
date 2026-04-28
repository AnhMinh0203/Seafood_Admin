using Microsoft.AspNetCore.Mvc;
using SeaFood.Orders;
using SeaFood.Orders.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/order")]
    [IgnoreAntiforgeryToken]
    public class OrderController : SeaFoodController
    {
        private readonly IOrderAppService _orderAppService;
        public OrderController(IOrderAppService orderAppService)
        {
            _orderAppService = orderAppService;
        }

        [HttpPost("checkout")]
        public async Task<BaseResponse<CheckoutResultDto>> Checkout([FromBody] CheckoutRequestDto input)
        {
          return await _orderAppService.CheckoutAsync(input);
        }
    }
}

using SeaFood.Orders.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Orders
{
    public interface IOrderAppService
    {
        Task<BaseResponse<CheckoutResultDto>> CheckoutAsync(CheckoutRequestDto input);

    }
}

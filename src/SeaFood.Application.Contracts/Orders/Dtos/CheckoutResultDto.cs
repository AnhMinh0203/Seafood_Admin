using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Orders.Dtos
{
    public class CheckoutResultDto
    {
        public string OrderId { get; set; } = string.Empty;

        /// <summary>
        /// COD hoặc VNPAY
        /// </summary>
        public string PaymentMethod { get; set; } = string.Empty;

        /// <summary>
        /// Chỉ có khi PaymentMethod = VNPAY
        /// </summary>
        public string? RedirectUrl { get; set; }

        public string OrderStatus { get; set; } = string.Empty;
    }

}

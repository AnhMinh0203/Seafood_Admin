using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Orders.Dtos
{
    public class CheckoutRequestDto
    {
        public CustomerCheckoutDto Customer { get; set; } = new();
        public string PaymentMethod { get; set; } = "COD";
        public List<CheckoutItemDto> Items { get; set; } = new();
        public decimal TotalAmount { get; set; }

    }

    public class CustomerCheckoutDto
    {
        public string FullName { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Address { get; set; } = "";
        public string? Note { get; set; }
    }

    public class CheckoutItemDto
    {
        public string ProductId { get; set; } = string.Empty;

        public string? ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

    }


}

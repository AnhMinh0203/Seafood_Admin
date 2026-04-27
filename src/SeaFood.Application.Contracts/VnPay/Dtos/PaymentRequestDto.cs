using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.VnPay.Dtos
{
    public class PaymentRequestDto
    {
        public int Amount { get; set; }
        public string Description { get; set; }
    }
}

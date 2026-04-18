using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Carts.Dtos
{
    public class UpdateCartQuantityDto
    {
        public Guid CartId { get; set; }
        public int Quantity { get; set; }
    }
}

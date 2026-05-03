using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;

namespace SeaFood.Entities
{
    public class OrderItem : Entity<Guid>
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        public Guid ProductId { get; set; }
        public int ProductUnitId { get; set; }

        // snapshot (quan trọng)
        public string ProductName { get; set; }
        public string UnitName { get; set; }
        public string? Image { get; set; }

        public int Quantity { get; set; }
        public decimal Price { get; set; } // giá tại thời điểm mua
    }
}

using SeaFood.Entities.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Order : AuditedEntity<Guid>
    {
        public string OrderCode { get; set; }
        public Guid? UserId { get; set; }

        // snapshot
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? Note { get; set; }

        // money
        public decimal TotalAmount { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public OrderStatus Status { get; set; }

        // VNPAY 
        public string? TransactionId { get; set; }
        public string? PaymentCode { get; set; }

        public List<OrderItem> Items { get; set; } = new();
    }
}

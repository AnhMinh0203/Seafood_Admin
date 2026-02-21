using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Order: AuditedAggregateRoot<Guid>
    {
        public Guid CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public int? VoucherId { get; set; }
        public Voucher Voucher { get; set; }
    }
}

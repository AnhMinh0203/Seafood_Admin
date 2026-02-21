using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class Voucher: AuditedAggregateRoot<int>
    {
        public decimal? DiscountAmount { get; set; }     // giảm theo số tiền
        public double? DiscountPercent { get; set; }     // giảm theo %
        public decimal? MaxDiscount { get; set; }        // optional
        public decimal? MinOrderValue { get; set; }      // optional
        public DateTime ExpirationDate { get; set; } 
    }
}

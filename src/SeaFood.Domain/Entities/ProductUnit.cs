using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace SeaFood.Entities
{
    public class ProductUnit: Entity<int>
    {
        public int ProductId { get; set; }
        public string UnitName { get; set; }     
        public decimal Price { get; set; }      
        public int StockQuantity { get; set; }
        public bool IsDefault { get; set; }
    }
}

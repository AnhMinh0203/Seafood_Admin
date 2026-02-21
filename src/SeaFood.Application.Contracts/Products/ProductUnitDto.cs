using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Products
{
    public class ProductUnitDto
    {
        public string UnitName { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public bool IsDefault { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Entities.Orders
{
    public enum OrderStatus
    {
        Pending = 0,       // mới tạo (COD hoặc VNPAY chưa trả tiền)
        Paid = 1,          // đã thanh toán (VNPAY success)
        Failed = 2,        // thanh toán thất bại / hủy
        Completed = 3,     // đã giao xong
        Cancelled = 4      // admin/user hủy
    }
}

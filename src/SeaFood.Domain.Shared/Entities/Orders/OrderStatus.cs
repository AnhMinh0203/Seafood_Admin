using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Entities.Orders
{
    public enum OrderStatus
    {
        Pending = 0,          // Đơn COD đang chờ xác nhận
        PendingPayment = 1,   // Đơn VNPAY chờ thanh toán
        Paid = 2,             // Đã thanh toán
        PaymentFailed = 3,    // Thanh toán thất bại
        Cancelled = 4,        // Đã hủy
        Completed = 5         // Hoàn tất
    }

}

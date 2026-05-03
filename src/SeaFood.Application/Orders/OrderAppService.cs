using Microsoft.AspNetCore.Http;
using SeaFood.Orders.Dtos;
using SeaFood.Utils;
using SeaFood.VnPay;
using SeaFood.VnPay.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace SeaFood.Orders
{
    public class OrderAppService: ApplicationService, IOrderAppService
    {
        private readonly IVnPayAppService _vnPayAppService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OrderAppService( IVnPayAppService vnPayAppService, IHttpContextAccessor httpContextAccessor)
        {
            _vnPayAppService = vnPayAppService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse<CheckoutResultDto>> CheckoutAsync(CheckoutRequestDto input)
        {
            try
            {
                var validationMessage = ValidateCheckoutInput(input);
                if (!string.IsNullOrWhiteSpace(validationMessage))
                {
                    return BaseResponse<CheckoutResultDto>.Fail(validationMessage);
                }

                var paymentMethod = input.PaymentMethod.Trim().ToUpper();

                // TODO: Sau này nên tính lại tiền từ DB, không tin TotalAmount/Price từ FE.
                var totalAmount = input.TotalAmount;

                if (totalAmount >= 0)
                {
                    totalAmount = input.Items.Sum(x => x.Price * x.Quantity);
                }

                if (totalAmount <= 0)
                {
                    return BaseResponse<CheckoutResultDto>.Fail("Tổng tiền đơn hàng không hợp lệ.");
                }

                // 1. Tạo mã đơn hàng
                var orderId = GenerateOrderId();

                // 2. TODO: Lưu order vào DB
                // Nếu COD:
                //      OrderStatus = Pending
                // Nếu VNPAY:
                //      OrderStatus = PendingPayment
                //
                // Ví dụ sau này:
                // var order = new Order(...)
                // await _orderRepository.InsertAsync(order);

                if (paymentMethod == "COD")
                {
                    // TODO: Lưu đơn COD trạng thái Pending/WaitingConfirm

                    var codResult = new CheckoutResultDto
                    {
                        OrderId = orderId,
                        PaymentMethod = "COD",
                        RedirectUrl = null,
                        OrderStatus = "Pending"
                    };

                    return BaseResponse<CheckoutResultDto>.Success(
                        "Đặt hàng thành công. Vui lòng thanh toán khi nhận hàng.",
                        codResult
                    );
                }

                if (paymentMethod == "VNPAY")
                {
                    // TODO: Lưu đơn VNPAY trạng thái PendingPayment trước khi tạo URL

                    var httpContext = _httpContextAccessor.HttpContext;

                    if (httpContext == null)
                    {
                        return BaseResponse<CheckoutResultDto>.Fail("Không lấy được HttpContext để tạo thanh toán VNPAY.");
                    }

                    var paymentModel = new PaymentInformationModel
                    {
                        OrderId = orderId,
                        Amount = totalAmount,
                        OrderType = "other",
                        OrderDescription = $"Thanh toán đơn hàng {orderId}",
                        Name = input.Customer.FullName
                    };

                    var paymentUrl = _vnPayAppService.CreatePaymentUrl(paymentModel, httpContext);

                    var vnpayResult = new CheckoutResultDto
                    {
                        OrderId = orderId,
                        PaymentMethod = "VNPAY",
                        RedirectUrl = paymentUrl,
                        OrderStatus = "PendingPayment"
                    };

                    return BaseResponse<CheckoutResultDto>.Success(
                        "Tạo đơn hàng và đường dẫn thanh toán thành công.",
                        vnpayResult
                    );
                }

                return BaseResponse<CheckoutResultDto>.Fail("Phương thức thanh toán không hợp lệ.");
            }
            catch (Exception ex)
            {
                return BaseResponse<CheckoutResultDto>.Fail($"Checkout lỗi: {ex.Message}");
            }
        }

        private static string? ValidateCheckoutInput(CheckoutRequestDto input)
        {
            if (input == null)
            {
                return "Dữ liệu checkout không hợp lệ.";
            }

            if (input.Customer == null)
            {
                return "Thiếu thông tin người nhận.";
            }

            if (string.IsNullOrWhiteSpace(input.Customer.FullName))
            {
                return "Vui lòng nhập họ tên người nhận.";
            }

            if (string.IsNullOrWhiteSpace(input.Customer.PhoneNumber))
            {
                return "Vui lòng nhập số điện thoại.";
            }

            if (string.IsNullOrWhiteSpace(input.Customer.Address))
            {
                return "Vui lòng nhập địa chỉ nhận hàng.";
            }

            if (string.IsNullOrWhiteSpace(input.PaymentMethod))
            {
                return "Vui lòng chọn phương thức thanh toán.";
            }

            var paymentMethod = input.PaymentMethod.Trim().ToUpper();

            if (paymentMethod != "COD" && paymentMethod != "VNPAY")
            {
                return "Phương thức thanh toán không hợp lệ.";
            }

            if (input.Items == null || !input.Items.Any())
            {
                return "Đơn hàng không có sản phẩm.";
            }

            if (input.Items.Any(x => string.IsNullOrWhiteSpace(x.ProductId)))
            {
                return "Sản phẩm trong đơn hàng không hợp lệ.";
            }

            if (input.Items.Any(x => x.Quantity <= 0))
            {
                return "Số lượng sản phẩm không hợp lệ.";
            }

            return null;
        }

        private static string GenerateOrderId()
        {
            return $"ORDER{DateTime.Now:yyyyMMddHHmmssfff}";
        }

    }
}

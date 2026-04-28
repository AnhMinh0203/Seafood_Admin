using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SeaFood.Utils;
using SeaFood.VnPay;
using SeaFood.VnPay.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/vnpay")]
    [IgnoreAntiforgeryToken]
    public class VnpayController: SeaFoodController
    {
        private readonly IVnPayAppService _vnPayAppService;
        private readonly IConfiguration _configuration;


        public VnpayController(IVnPayAppService vnPayAppService, IConfiguration configuration)
        {
            _vnPayAppService = vnPayAppService;
            _configuration = configuration;
        }


        [HttpPost("create-payment-url")]
        public BaseResponse<string> CreatePaymentUrl([FromBody] PaymentInformationModel model)
        {
            try
            {
                return BaseResponse<string>.Success("Success", _vnPayAppService.CreatePaymentUrl(model, HttpContext));
            }
            catch (Exception ex)
            {
                return BaseResponse<string>.Fail($"Lỗi tạo payment url: {ex.Message}");
            }
        }

        [HttpGet("payment-callback")]
        public IActionResult PaymentCallback()
        {
            var clientResultUrl = _configuration["ClientApp:PaymentResultUrl"];
            try
            {
                var response = _vnPayAppService.PaymentExecute(Request.Query);

                if (response == null)
                {
                    var url = $"{clientResultUrl}?status=error&message={Uri.EscapeDataString("Không nhận được dữ liệu thanh toán")}";
                    return Redirect(url);
                }

                if (!response.Success)
                {
                    var failedUrl =
                        $"{clientResultUrl}" +
                        $"?status=failed" +
                        $"&orderId={Uri.EscapeDataString(response.OrderId ?? string.Empty)}" +
                        $"&code={Uri.EscapeDataString(response.VnPayResponseCode ?? string.Empty)}";

                    return Redirect(failedUrl);
                }

                // TODO: Sau này update order/payment trong DB tại đây
                // Ví dụ:
                // var orderId = response.OrderId;
                // var transactionId = response.TransactionId;
                // update order status = Paid

                var successUrl =
                    $"{clientResultUrl}" +
                    $"?status=success" +
                    $"&orderId={Uri.EscapeDataString(response.OrderId ?? string.Empty)}" +
                    $"&transactionId={Uri.EscapeDataString(response.TransactionId ?? string.Empty)}";

                return Redirect(successUrl);
            }
            catch (Exception ex)
            {
                var errorUrl =
                    $"{clientResultUrl}" +
                    $"?status=error" +
                    $"&message={Uri.EscapeDataString(ex.Message)}";

                return Redirect(errorUrl);
            }
        }
    }
}

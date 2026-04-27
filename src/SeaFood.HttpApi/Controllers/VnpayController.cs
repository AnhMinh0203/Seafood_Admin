using Microsoft.AspNetCore.Mvc;
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

        public VnpayController(IVnPayAppService vnPayAppService)
        {
            _vnPayAppService = vnPayAppService;
        }


        [HttpPost("create-payment-url")]
        public BaseResponse<string> CreatePaymentUrl([FromBody] PaymentInformationModel model)
        {
            try
            {
                return BaseResponse<string>.Success(_vnPayAppService.CreatePaymentUrl(model, HttpContext));
            }
            catch (Exception ex)
            {
                return BaseResponse<string>.Fail($"Lỗi tạo payment url: {ex.Message}");
            }
        }

        [HttpGet("payment-callback")]
        public BaseResponse<PaymentResponseModel> PaymentCallback()
        {
            try
            {
                var response = _vnPayAppService.PaymentExecute(Request.Query);

                return BaseResponse<PaymentResponseModel>.Success("Thanh toán thành công", response);
            }
            catch (Exception ex)
            {
                return BaseResponse<PaymentResponseModel>.Fail($"Callback lỗi: {ex.Message}");

            }
        }
    }
}

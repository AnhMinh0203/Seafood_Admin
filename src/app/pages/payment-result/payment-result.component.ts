import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

type PaymentStatus = 'success' | 'failed' | 'error' | 'unknown';
type PaymentMethod = 'COD' | 'VNPAY' | 'UNKNOWN';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  status: PaymentStatus = 'unknown';
  paymentMethod: PaymentMethod = 'UNKNOWN';

  orderId = '';
  transactionId = '';
  code = '';
  message = '';

  constructor() {
    console.log('PaymentResultComponent loaded');
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const statusParam = params.get('status');
      const methodParam = params.get('method');

      this.status = this.normalizeStatus(statusParam);
      this.paymentMethod = this.normalizePaymentMethod(methodParam);

      this.orderId = params.get('orderId') || '';
      this.transactionId = params.get('transactionId') || '';
      this.code = params.get('code') || '';
      this.message = params.get('message') || '';

      /**
       * Nếu callback VNPAY chưa truyền method=VNPAY,
       * nhưng có transactionId hoặc code thì có thể suy ra là VNPAY.
       */
      if (this.paymentMethod === 'UNKNOWN' && (this.transactionId || this.code)) {
        this.paymentMethod = 'VNPAY';
      }
    });
  }

  private normalizeStatus(status: string | null): PaymentStatus {
    if (status === 'success' || status === 'failed' || status === 'error') {
      return status;
    }

    return 'unknown';
  }

  private normalizePaymentMethod(method: string | null): PaymentMethod {
    if (method === 'COD' || method === 'VNPAY') {
      return method;
    }

    return 'UNKNOWN';
  }

  get isSuccess(): boolean {
    return this.status === 'success';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isError(): boolean {
    return this.status === 'error';
  }

  get isUnknown(): boolean {
    return this.status === 'unknown';
  }

  get paymentMethodText(): string {
    switch (this.paymentMethod) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';

      case 'VNPAY':
        return 'VNPAY';

      default:
        return 'Không xác định';
    }
  }

  get title(): string {
    switch (this.status) {
      case 'success':
        if (this.paymentMethod === 'COD') {
          return 'Đặt hàng thành công';
        }

        return 'Thanh toán thành công';

      case 'failed':
        return 'Thanh toán thất bại';

      case 'error':
        return 'Có lỗi xảy ra';

      default:
        return 'Không xác định kết quả';
    }
  }

  get responseMessage(): string {
    if (this.message) {
      return this.message;
    }

    switch (this.code) {
      case '00':
        return 'Giao dịch thành công.';

      case '07':
        return 'Giao dịch bị nghi ngờ gian lận. Vui lòng liên hệ ngân hàng hoặc bộ phận hỗ trợ.';

      case '09':
        return 'Thẻ hoặc tài khoản chưa đăng ký dịch vụ Internet Banking.';

      case '10':
        return 'Thông tin xác thực giao dịch không chính xác.';

      case '11':
        return 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.';

      case '12':
        return 'Thẻ hoặc tài khoản của bạn đang bị khóa.';

      case '13':
        return 'Bạn đã nhập sai mật khẩu xác thực giao dịch.';

      case '24':
        return 'Bạn đã hủy giao dịch thanh toán.';

      case '51':
        return 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch.';

      case '65':
        return 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.';

      case '75':
        return 'Ngân hàng thanh toán đang bảo trì. Vui lòng thử lại sau.';

      case '79':
        return 'Bạn đã nhập sai mật khẩu thanh toán quá số lần quy định.';

      case '99':
        return 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.';

      default:
        if (this.isFailed) {
          return 'Giao dịch chưa được hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
        }

        if (this.isError) {
          return 'Hệ thống không thể xử lý kết quả thanh toán.';
        }

        return '';
    }
  }

  get description(): string {
    switch (this.status) {
      case 'success':
        if (this.paymentMethod === 'COD') {
          return 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý.';
        }

        return 'Cảm ơn bạn đã mua hàng. Giao dịch của bạn đã được ghi nhận.';

      case 'failed':
        return this.responseMessage;

      case 'error':
        return this.responseMessage || 'Hệ thống không thể xử lý kết quả thanh toán.';

      default:
        return 'Không thể xác định trạng thái thanh toán. Vui lòng kiểm tra lại đơn hàng.';
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goOrders(): void {
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
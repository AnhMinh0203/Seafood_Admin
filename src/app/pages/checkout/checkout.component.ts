import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../shared/services/checkout.service';
import { UserService } from '../../shared/services/user.service';
import { ProductDetailVm, ProductUnitVm } from '../../shared/models/product-detail.model';
import { ProductService } from '../../shared/services/product.service';

type PaymentMethod = 'COD' | 'VNPAY';
interface CheckoutItemVm {
  productId: string;
  productUnitId: number;
  unitName: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  stockQuantity: number;
}
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private checkoutService = inject(CheckoutService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);


  isSubmitting = false;
  isLoadingItems = false;

  currentStep: 1 | 2 = 1;

  items: CheckoutItemVm[] = [];


  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    note: [''],
    paymentMethod: ['COD' as PaymentMethod, Validators.required]
  });

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        if (!res?.isSuccess || !res.data) return;

        const u = res.data;

        this.checkoutForm.patchValue({
          fullName: u.fullName ?? '',
          phoneNumber: u.phoneNumber ?? '',
          address: u.address ?? ''
        });

        const cFullName = this.checkoutForm.get('fullName')!;
        const cPhone = this.checkoutForm.get('phoneNumber')!;
        const cAddress = this.checkoutForm.get('address')!;

        cFullName.updateValueAndValidity();
        cPhone.updateValueAndValidity();
        cAddress.updateValueAndValidity();

        if (cFullName.valid && cPhone.valid && cAddress.valid) {
          this.currentStep = 2;
        }
      },
      error: () => {
        // Chưa đăng nhập thì bỏ qua
      }
    });
  }

  private loadUserProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        if (!res?.isSuccess || !res.data) return;

        const u = res.data;

        this.checkoutForm.patchValue({
          fullName: u.fullName ?? '',
          phoneNumber: u.phoneNumber ?? '',
          address: u.address ?? ''
        });

        const cFullName = this.checkoutForm.get('fullName')!;
        const cPhone = this.checkoutForm.get('phoneNumber')!;
        const cAddress = this.checkoutForm.get('address')!;

        cFullName.updateValueAndValidity();
        cPhone.updateValueAndValidity();
        cAddress.updateValueAndValidity();

        if (cFullName.valid && cPhone.valid && cAddress.valid) {
          this.currentStep = 2;
        }
      },
      error: () => {
        // Chưa đăng nhập thì bỏ qua
      }
    });
  }

  private loadCheckoutItems(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode');

    if (mode === 'buy-now') {
      this.loadBuyNowItem();
      return;
    }

    /**
     * Nếu sau này checkout từ giỏ hàng thì xử lý ở đây.
     * Ví dụ:
     * this.loadCartItems();
     */
    this.items = [];
  }

  private loadBuyNowItem(): void {
    const slug = this.route.snapshot.queryParamMap.get('slug');
    const productIdParam = this.route.snapshot.queryParamMap.get('productId');
    const quantityParam = this.route.snapshot.queryParamMap.get('quantity');
    const unitIdParam = this.route.snapshot.queryParamMap.get('unitId');
    const unitNameParam = this.route.snapshot.queryParamMap.get('unitName') || '';

    const productId = Number(productIdParam);
    const quantity = Number(quantityParam || 1);
    const unitId = Number(unitIdParam);

    if (!slug) {
      alert('Không tìm thấy thông tin sản phẩm.');
      this.router.navigate(['/']);
      return;
    }

    if (!productId || Number.isNaN(productId)) {
      alert('Mã sản phẩm không hợp lệ.');
      this.router.navigate(['/']);
      return;
    }

    if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
      alert('Số lượng sản phẩm không hợp lệ.');
      this.router.navigate(['/']);
      return;
    }

    this.isLoadingItems = true;

    this.productService.getDetailBySlug(slug).subscribe({
      next: (product) => {
        this.isLoadingItems = false;

        if (!product) {
          alert('Không tìm thấy sản phẩm.');
          this.router.navigate(['/']);
          return;
        }

        const selectedUnit = this.findSelectedUnit(product, unitId, unitNameParam);

        if (!selectedUnit) {
          alert('Không tìm thấy đơn vị sản phẩm.');
          this.router.navigate(['/']);
          return;
        }

        const stockQuantity = selectedUnit.stockQuantity ?? 0;

        if (stockQuantity <= 0) {
          alert('Sản phẩm đã hết hàng.');
          this.router.navigate(['/']);
          return;
        }

        if (quantity > stockQuantity) {
          alert('Số lượng vượt quá tồn kho.');
          this.router.navigate(['/']);
          return;
        }

        this.items = [
          {
            productId: product.id,
            productUnitId: selectedUnit.id,
            unitName: selectedUnit.unitName,
            name: product.name,
            quantity,
            price: selectedUnit.price ?? 0,
            image: product.coverImage,
            stockQuantity
          }
        ];
      },
      error: (err) => {
        this.isLoadingItems = false;
        console.error('Load buy now item failed:', err);
        alert('Có lỗi xảy ra khi tải thông tin sản phẩm.');
        this.router.navigate(['/']);
      }
    });
  }

  private findSelectedUnit(
    product: ProductDetailVm,
    unitId: number,
    unitName: string
  ): ProductUnitVm | null {
    if (!product.units?.length) return null;

    if (unitId && !Number.isNaN(unitId)) {
      const unitById = product.units.find(x => x.id === unitId);
      if (unitById) return unitById;
    }

    if (unitName) {
      const unitByName = product.units.find(x => x.unitName === unitName);
      if (unitByName) return unitByName;
    }

    return product.units.find(x => x.isDefault) || product.units[0];
  }


  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get deliveryFee(): number {
    return 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get paymentMethod(): PaymentMethod {
    return this.checkoutForm.value.paymentMethod as PaymentMethod;
  }

  goNextFromStep1(): void {
    const fullName = this.checkoutForm.get('fullName')!;
    const phoneNumber = this.checkoutForm.get('phoneNumber')!;
    const address = this.checkoutForm.get('address')!;

    fullName.markAsTouched();
    phoneNumber.markAsTouched();
    address.markAsTouched();

    fullName.updateValueAndValidity();
    phoneNumber.updateValueAndValidity();
    address.updateValueAndValidity();

    if (!fullName.valid || !phoneNumber.valid || !address.valid) return;

    this.currentStep = 2;
  }

  submit(): void {
    if (this.currentStep !== 2) return;

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      customer: {
        fullName: this.checkoutForm.value.fullName,
        phoneNumber: this.checkoutForm.value.phoneNumber,
        address: this.checkoutForm.value.address,
        note: this.checkoutForm.value.note
      },
      paymentMethod: this.paymentMethod,
      items: this.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.total
    };

    this.checkoutService.checkout(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (!res.isSuccess || !res.data) {
          alert(res.message || 'Không thể tạo đơn hàng.');
          return;
        }

        /**
         * Nếu là VNPAY thì redirect sang trang thanh toán VNPAY.
         */
        if (res.data.paymentMethod === 'VNPAY') {
          if (!res.data.redirectUrl) {
            alert('Không nhận được đường dẫn thanh toán VNPAY.');
            return;
          }

          window.location.href = res.data.redirectUrl;
          return;
        }

        /**
         * Nếu là COD thì đơn hàng đã tạo thành công.
         *
         * Lưu ý:
         * Không truyền status: 'cod'
         * Vì PaymentResultComponent chỉ hiểu success | failed | error | unknown.
         */
        this.router.navigate(['/payment-result'], {
          queryParams: {
            status: 'success',
            method: 'COD',
            orderId: res.data.orderId
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
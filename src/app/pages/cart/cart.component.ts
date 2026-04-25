import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { ToastService } from '../../shared/services/toast.service';
import { CartItem } from '../../shared/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  readonly items = this.cartService.items;
  readonly loading = this.cartService.loading;

  discount = 0;
  delivery = 0;

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly total = computed(() =>
    this.subtotal() - this.discount + this.delivery
  );

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getMyCart().subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.toast.error(res.message || 'Không thể tải giỏ hàng.');
        }
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Không thể tải giỏ hàng.';
        this.toast.error(message);
      }
    });
  }

  increaseQty(item: CartItem): void {
    this.cartService.increaseQty(item).subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.toast.error(res.message || 'Không thể tăng số lượng.');
        }
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Không thể tăng số lượng.';
        this.toast.error(message);
      }
    });
  }

  decreaseQty(item: CartItem): void {
    this.cartService.decreaseQty(item).subscribe({
      next: (res: any) => {
        if (!res.isSuccess) {
          this.toast.error(res.message || 'Không thể giảm số lượng.');
        }
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Không thể giảm số lượng.';
        this.toast.error(message);
      }
    });
  }

  removeItem(cartId: string): void {
    this.cartService.removeItem(cartId).subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.toast.error(res.message || 'Không thể xóa sản phẩm.');
          return;
        }

        this.toast.success(res.message || 'Đã xóa sản phẩm khỏi giỏ hàng.');
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Không thể xóa sản phẩm.';
        this.toast.error(message);
      }
    });
  }

  checkout(): void {
    console.log('Checkout', this.items());
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  }
}
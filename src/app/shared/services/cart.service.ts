import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, tap } from 'rxjs';

import {
  AddToCartDto,
  CartItem,
  CartSummary,
  UpdateCartQuantityDto
} from '../models/cart-item.model';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/app/cart';

  private readonly _items = signal<CartItem[]>([]);
  private readonly _loading = signal(false);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly cartCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // =========================
  // Private helpers
  // =========================

  private setLoading(value: boolean): void {
    this._loading.set(value);
  }

  private setItems(items: CartItem[] | null | undefined): void {
    this._items.set(items ?? []);
  }

  private updateItemQuantity(cartId: string, quantity: number): void {
    this._items.update(items =>
      items.map(item =>
        item.id === cartId
          ? { ...item, quantity }
          : item
      )
    );
  }

  private removeItemFromState(cartId: string): void {
    this._items.update(items => items.filter(item => item.id !== cartId));
  }

  private applyCartSummary(summary: CartSummary | null | undefined): void {
    this.setItems(summary?.items ?? []);
  }

  // =========================
  // Public API
  // =========================

  getMyCart(): Observable<BaseResponse<CartSummary>> {
    this.setLoading(true);

    return this.http.get<BaseResponse<CartSummary>>(
      `${this.baseUrl}/my-cart`,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess) {
          this.applyCartSummary(res.data);
        }
      }),
      finalize(() => this.setLoading(false))
    );
  }

  addToCart(payload: AddToCartDto): Observable<BaseResponse<CartItem>> {
    return this.http.post<BaseResponse<CartItem>>(
      `${this.baseUrl}/add`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess) {
          this.loadCartSilently();
        }
      })
    );
  }

  updateQuantity(payload: UpdateCartQuantityDto): Observable<BaseResponse<CartItem>> {
    return this.http.put<BaseResponse<CartItem>>(
      `${this.baseUrl}/update-quantity`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.updateItemQuantity(res.data.id, res.data.quantity);
        }
      })
    );
  }

  loadCartSilently(): void {
    this.getMyCart()
      .pipe(
        catchError(() => {
          this.clearCartState();
          return of(null);
        })
      )
      .subscribe();
  }

  clearCartState(): void {
    this.setItems([]);
  }

  increaseQty(item: CartItem): Observable<BaseResponse<CartItem>> {
    return this.updateQuantity({
      cartId: item.id,
      quantity: item.quantity + 1
    });
  }

  decreaseQty(item: CartItem): Observable<BaseResponse<CartItem> | BaseResponse<boolean>> {
    if (item.quantity <= 1) {
      return this.removeItem(item.id);
    }

    return this.updateQuantity({
      cartId: item.id,
      quantity: item.quantity - 1
    });
  }

  removeItem(cartId: string): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(
      `${this.baseUrl}/remove/${cartId}`,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess) {
          this.removeItemFromState(cartId);
        }
      })
    );
  }

  clearCart(): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(
      `${this.baseUrl}/clear`,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess) {
          this.clearCartState();
        }
      })
    );
  }
}
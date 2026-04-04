import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly cartCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addItem(item: CartItem): void {
    const items = this._items();
    const existing = items.find(x => x.id === item.id);

    if (existing) {
      this._items.set(
        items.map(x =>
          x.id === item.id
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        )
      );
    } else {
      this._items.set([...items, item]);
    }
  }

  increaseQty(itemId: string): void {
    this._items.set(
      this._items().map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  decreaseQty(itemId: string): void {
    this._items.set(
      this._items()
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  removeItem(itemId: string): void {
    this._items.set(this._items().filter(item => item.id !== itemId));
  }

  clearCart(): void {
    this._items.set([]);
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';

interface CartItem {
  id: number;
  name: string;
  image: string;
  meta: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  cartService = inject(CartService);
  items: CartItem[] = [
    {
      id: 1,
      name: 'Caesar with Chicken',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=300&q=80',
      meta: '110 kcal - 200 g',
      price: 10.99,
      quantity: 1
    }
  ];

  discount = 0;
  delivery = 0;

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get total(): number {
    return this.subtotal - this.discount + this.delivery;
  }

  increaseQty(item: CartItem): void {
    item.quantity++;
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(itemId: number): void {
    this.items = this.items.filter(x => x.id !== itemId);
  }

  checkout(): void {
    console.log('Checkout', this.items);
  }
}
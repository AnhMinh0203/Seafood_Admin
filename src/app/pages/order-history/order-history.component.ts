import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface OrderHistoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderHistory {
  id: number;
  orderCode: string;
  createdTime: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  customerName: string;
  phoneNumber: string;
  address: string;
  note?: string;
  items: OrderHistoryItem[];
  totalAmount: number;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  orders: OrderHistory[] = [
    {
      id: 1,
      orderCode: 'SF20260403001',
      createdTime: '2026-04-03T10:15:00',
      status: 'completed',
      customerName: 'Nguyễn Văn Minh',
      phoneNumber: '0901234567',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      note: 'Giao trước 11h30 nếu có thể',
      items: [
        {
          id: 1,
          name: 'Tôm sú tươi',
          quantity: 2,
          price: 220000,
          image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400'
        },
        {
          id: 2,
          name: 'Cua biển Cà Mau',
          quantity: 1,
          price: 390000,
          image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400'
        }
      ],
      totalAmount: 830000
    },
    {
      id: 2,
      orderCode: 'SF20260401002',
      createdTime: '2026-04-01T18:40:00',
      status: 'shipping',
      customerName: 'Nguyễn Văn Minh',
      phoneNumber: '0901234567',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      note: 'Gọi trước khi giao',
      items: [
        {
          id: 3,
          name: 'Mực ống tươi',
          quantity: 2,
          price: 180000,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'
        },
        {
          id: 4,
          name: 'Hàu sữa',
          quantity: 12,
          price: 15000,
          image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400'
        }
      ],
      totalAmount: 540000
    },
    {
      id: 3,
      orderCode: 'SF20260328003',
      createdTime: '2026-03-28T09:20:00',
      status: 'cancelled',
      customerName: 'Nguyễn Văn Minh',
      phoneNumber: '0901234567',
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      note: 'Khách đổi lịch nhận hàng',
      items: [
        {
          id: 5,
          name: 'Cá hồi phi lê',
          quantity: 1,
          price: 310000,
          image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400'
        }
      ],
      totalAmount: 310000
    }
  ];

  trackByOrderId(index: number, order: OrderHistory): number {
    return order.id;
  }

  trackByItemId(index: number, item: OrderHistoryItem): number {
    return item.id;
  }

  getStatusLabel(status: OrderHistory['status']): string {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  getStatusClass(status: OrderHistory['status']): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipping':
        return 'status-shipping';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getTotalItems(order: OrderHistory): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
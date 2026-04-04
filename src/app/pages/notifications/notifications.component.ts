import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Đơn hàng đã được xác nhận',
      message: 'Đơn hàng #DH001 của bạn đã được xác nhận và đang được chuẩn bị.',
      time: '2 phút trước',
      type: 'order',
      isRead: false
    },
    {
      id: 2,
      title: 'Ưu đãi mới hôm nay',
      message: 'Giảm 20% cho tất cả món hải sản tươi sống trong ngày hôm nay.',
      time: '1 giờ trước',
      type: 'promo',
      isRead: false
    },
    {
      id: 3,
      title: 'Cập nhật hệ thống',
      message: 'Ứng dụng đã được nâng cấp để mang lại trải nghiệm tốt hơn.',
      time: 'Hôm qua',
      type: 'system',
      isRead: true
    }
  ];

  markAsRead(item: NotificationItem): void {
    item.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(item => ({
      ...item,
      isRead: true
    }));
  }

  getUnreadCount(): number {
    return this.notifications.filter(item => !item.isRead).length;
  }

  getIcon(type: NotificationItem['type']): string {
    switch (type) {
      case 'order':
        return 'fa-solid fa-bag-shopping';
      case 'promo':
        return 'fa-solid fa-tags';
      case 'system':
        return 'fa-solid fa-bell';
      default:
        return 'fa-solid fa-bell';
    }
  }

  getIconClass(type: NotificationItem['type']): string {
    switch (type) {
      case 'order':
        return 'order';
      case 'promo':
        return 'promo';
      case 'system':
        return 'system';
      default:
        return 'system';
    }
  }
}
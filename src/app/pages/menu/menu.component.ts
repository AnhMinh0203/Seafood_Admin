import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface MenuCategory {
  key: string;
  label: string;
  subLabel: string;
  icon: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private router: Router) { }

  activeCategory = 'all';

  categories: MenuCategory[] = [
    {
      key: 'all',
      label: 'Tất cả',
      subLabel: 'Danh mục',
      icon: 'fa fa-border-all'
    },
    {
      key: 'seafood',
      label: 'Hải sản tươi',
      subLabel: 'Fresh',
      icon: 'fa fa-fish'
    },
    {
      key: 'cha',
      label: 'Chả các loại',
      subLabel: 'Best Seller',
      icon: 'fa fa-utensils'
    },
    {
      key: 'frozen',
      label: 'Đông lạnh',
      subLabel: 'Preserved',
      icon: 'fa fa-snowflake'
    },
    {
      key: 'combo',
      label: 'Combo tiện lợi',
      subLabel: 'Family',
      icon: 'fa fa-box'
    }
  ];

  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Tôm Sú Tươi',
      price: 220000,
      description: 'Tôm sú tươi ngon, thịt chắc ngọt, phù hợp hấp, nướng hoặc chế biến món gia đình.',
      image: 'assets/img/menu-1.jpg',
      category: 'seafood',
      isPopular: true
    },
    {
      id: '2',
      name: 'Mực Lá Tươi',
      price: 180000,
      description: 'Mực lá tươi, giòn tự nhiên, thích hợp chiên, hấp gừng hoặc nướng sa tế.',
      image: 'assets/img/menu-2.jpg',
      category: 'seafood'
    },
    {
      id: '3',
      name: 'Chả Cá Thác Lác',
      price: 95000,
      description: 'Chả cá dai ngon, đậm vị, tiện lợi cho bữa ăn gia đình hằng ngày.',
      image: 'assets/img/menu-3.jpg',
      category: 'cha',
      isPopular: true
    },
    {
      id: '4',
      name: 'Chả Mực Giã Tay',
      price: 165000,
      description: 'Chả mực thơm giòn, được chế biến từ nguyên liệu tươi, chuẩn vị hấp dẫn.',
      image: 'assets/img/menu-4.jpg',
      category: 'cha',
      isPopular: true
    },
    {
      id: '5',
      name: 'Cá Viên Đông Lạnh',
      price: 85000,
      description: 'Cá viên đông lạnh tiện lợi, dễ chế biến cho các món chiên, lẩu hoặc ăn vặt.',
      image: 'assets/img/menu-5.jpg',
      category: 'frozen'
    },
    {
      id: '6',
      name: 'Combo Hải Sản Gia Đình',
      price: 399000,
      description: 'Combo tiết kiệm gồm nhiều loại hải sản và chả, phù hợp cho bữa ăn gia đình.',
      image: 'assets/img/menu-6.jpg',
      category: 'combo',
      isPopular: true
    }
  ];

  get filteredItems(): MenuItem[] {
    if (this.activeCategory === 'all') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.activeCategory);
  }

  get isMenuPage(): boolean {
    return this.router.url.includes('menu');
  }

  selectCategory(categoryKey: string): void {
    this.activeCategory = categoryKey;
  }

  goToDetail(item: MenuItem): void {
    this.router.navigate(['/product-detail', item.id]);
  }

  addToCart(item: MenuItem): void {
    console.log('Add to cart:', item);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + 'đ';
  }
}
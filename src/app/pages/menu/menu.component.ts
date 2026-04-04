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
  imports: [CommonModule,RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private router: Router) {}

  activeCategory = 'breakfast';

  categories: MenuCategory[] = [
    {
      key: 'breakfast',
      label: 'Breakfast',
      subLabel: 'Popular',
      icon: 'fa fa-coffee'
    },
    {
      key: 'lunch',
      label: 'Lunch',
      subLabel: 'Special',
      icon: 'fa fa-hamburger'
    },
    {
      key: 'dinner',
      label: 'Dinner',
      subLabel: 'Lovely',
      icon: 'fa fa-utensils'
    }
  ];

  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Burger',
      price: 115,
      description: 'Burger gà giòn, rau tươi và sốt đặc biệt.',
      image: 'assets/img/menu-1.jpg',
      category: 'breakfast',
      isPopular: true
    },
    {
      id: '2',
      name: 'Beef Burger',
      price: 135,
      description: 'Bò nướng mềm, phô mai thơm béo, bánh mì nướng giòn.',
      image: 'assets/img/menu-2.jpg',
      category: 'breakfast'
    },
    {
      id: '3',
      name: 'Italian Pizza',
      price: 210,
      description: 'Pizza phong cách Ý với phô mai và xúc xích.',
      image: 'assets/img/menu-3.jpg',
      category: 'lunch',
      isPopular: true
    },
    {
      id: '4',
      name: 'Seafood Pasta',
      price: 189,
      description: 'Mì Ý hải sản sốt kem đậm vị.',
      image: 'assets/img/menu-4.jpg',
      category: 'lunch'
    },
    {
      id: '5',
      name: 'Grilled Salmon',
      price: 255,
      description: 'Cá hồi nướng dùng kèm rau củ tươi.',
      image: 'assets/img/menu-5.jpg',
      category: 'dinner',
      isPopular: true
    },
    {
      id: '6',
      name: 'Steak Premium',
      price: 320,
      description: 'Bít tết mềm mọng, sốt tiêu đen đặc biệt.',
      image: 'assets/img/menu-6.jpg',
      category: 'dinner'
    }
  ];

  get filteredItems(): MenuItem[] {
    return this.menuItems.filter(item => item.category === this.activeCategory);
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
    return '$' + price;
  }
}
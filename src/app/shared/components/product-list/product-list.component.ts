import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  constructor(private router: Router) { }

  @Input() products: Product[] = [];
  @Input() showHeader = true;
  @Input() layout: 'scroll' | 'grid' = 'scroll';

  defaultProducts: Product[] = [
    {
      id: '1',
      name: 'Caesar with Chicken',
      price: 10.99,
      weight: '200g',
      image: 'assets/img/food-1.png',
      isFavorite: false
    },
    {
      id: '2',
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: '4',
      name: 'Grilled Salmon',
      price: 18.99,
      weight: '300g',
      image: 'assets/img/food-1.png',
      isFavorite: false
    }
  ];

  get displayProducts(): Product[] {
    return this.products.length > 0 ? this.products : this.defaultProducts;
  }

  goToDetail(product: Product): void {
    this.router.navigate(['/product-detail', product.id]);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    product.isFavorite = !product.isFavorite;
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    console.log('Add to cart', product);
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface Product {
  id: number;
  name: string;
  price: number;
  weight: string;
  image: string;
  isFavorite: boolean;
}
@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})


export class ProductListComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Caesar with Chicken',
      price: 10.99,
      weight: '200g',
      image: 'assets/img/food-1.png',
      isFavorite: false
    },
    {
      id: 2,
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: 3,
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: 5,
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: 6,
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-2.png',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Beef Steak',
      price: 15.99,
      weight: '250g',
      image: 'assets/img/food-1.png',
      isFavorite: false
    }
  ];

  toggleFavorite(product: Product) {
    product.isFavorite = !product.isFavorite;
  }

  addToCart(product: Product) {
    console.log('Add to cart', product);
  }
}

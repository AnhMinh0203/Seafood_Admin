import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductListComponent } from '../../shared/components/product-list/product-list.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductListComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  favoriteProducts: Product[] = [
    {
      id: '1',
      name: 'Caesar with Chicken',
      price: 10.99,
      weight: '200g',
      image: 'assets/img/food-1.png',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Creamy Chicken Alfredo',
      price: 13.49,
      weight: '200g',
      image: 'assets/img/food-2.png',
      isFavorite: true
    }
  ];
}


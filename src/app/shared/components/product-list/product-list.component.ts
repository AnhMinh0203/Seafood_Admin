import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductCardVm } from '../../models/product-card.model';
import { ProductService } from '../../services/product.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  @Input() showHeader = true;
  @Input() layout: 'scroll' | 'grid' = 'scroll';

  displayProducts: ProductCardVm[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private favoriteService: FavoriteService

  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getPagedCards({
      skipCount: 0,
      maxResultCount: 10,
      sorting: ''
    }).subscribe({
      next: (res) => {
        this.displayProducts = res.items ?? [];
        this.loading = false;
        console.log('Product cards:', this.displayProducts);
      },
      error: (err) => {
        console.error('Load products failed:', err);
        this.loading = false;
      }
    });
  }

  goToDetail(product: ProductCardVm): void {
    this.router.navigate(['/products', product.slug], {
      state: { productCard: product }
    });
  }

  toggleFavorite(item: ProductCardVm, event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggle(item.id).subscribe({
      next: (res) => {
        item.isFavorite = res.isFavorite;
        console.log(res.message);
      },
      error: (err) => {
        console.error('Toggle favorite failed:', err);
      }
    });
  }

  addToCart(product: ProductCardVm, event: Event): void {
    event.stopPropagation();
    console.log('Add to cart', product);
  }
}
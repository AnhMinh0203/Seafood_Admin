import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductCardVm } from '../../models/product-card.model';
import { ProductService } from '../../services/product.service';

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

  @Input() products: Product[] = [];
  @Input() showHeader = true;
  @Input() layout: 'scroll' | 'grid' = 'scroll';

  displayProducts: ProductCardVm[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts(0, 10, '').subscribe({
      next: (res) => {
        this.displayProducts = res;
        this.loading = false;
        console.log("Product res: ");
        console.log(this.displayProducts);
      },
      error: (err) => {
        console.error('Load products failed:', err);
        this.loading = false;
      }
    });
  }



  // get displayProducts(): Product[] {
  //   return this.products.length > 0 ? this.products : this.defaultProducts;
  // }

  goToDetail(product: ProductCardVm): void {
    this.router.navigate(['/product-detail', product.id]);
  }

  toggleFavorite(product: ProductCardVm, event: Event): void {
    event.stopPropagation();
    product.isFavorite = !product.isFavorite;
  }

  addToCart(product: ProductCardVm, event: Event): void {
    event.stopPropagation();
    console.log('Add to cart', product);
  }
}
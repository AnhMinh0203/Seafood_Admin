import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteProductVm, ToggleFavoriteResultVm } from '../../shared/models/favorite.model';
import { FavoriteService } from '../../shared/services/favorite.service';
import { ToastService } from '../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  favoriteProducts: FavoriteProductVm[] = [];
  loading = false;
  removingIds = new Set<string>();

  constructor(
    private favoriteService: FavoriteService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;

    this.favoriteService.getMyFavorites()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.favoriteProducts = res || [];
          console.log("favoriteProducts: ", this.favoriteProducts)
        },
        error: (err) => {
          console.error('Load favorites failed:', err);
          this.toast.error('Không thể tải danh sách yêu thích.');
        }
      });
  }

  removeFavorite(item: FavoriteProductVm): void {
    const productId = item.productId;

    if (this.removingIds.has(productId)) {
      return;
    }

    this.removingIds.add(productId);

    this.favoriteService.remove(productId)
      .pipe(finalize(() => this.removingIds.delete(productId)))
      .subscribe({
        next: (res: ToggleFavoriteResultVm) => {
          this.favoriteProducts = this.favoriteProducts.filter(x => x.productId !== productId);
          this.toast.success(res?.message || 'Đã bỏ yêu thích.');
        },
        error: (err) => {
          console.error('Remove favorite failed:', err);

          const message =
            err?.error?.error?.message ||
            err?.error?.message ||
            'Không thể bỏ yêu thích sản phẩm.';

          this.toast.error(message);
        }
      });
  }

  isRemoving(productId: string): boolean {
    return this.removingIds.has(productId);
  }

  getProductLink(item: FavoriteProductVm): any[] {
    return item.slug ? ['/product-detail', item.slug] : ['/product', item.productId];
  }
}


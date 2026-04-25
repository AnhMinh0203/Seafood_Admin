import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuService } from '../../shared/services/menu.service';
import { MenuCategoryVm, MenuProductVm } from '../../shared/models/menu.model';
import { ToastService } from '../../shared/services/toast.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  cartService = inject(CartService);

  constructor(
    private router: Router,
    private menuService: MenuService,
    private toast: ToastService
  ) { }

  activeCategory = 'all';
  categories: MenuCategoryVm[] = [];
  menuItems: MenuProductVm[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.loading = true;

    this.menuService.getMenu().subscribe({
      next: (res) => {
        this.categories = (res.categories || []).filter(x => !!x.key);

        const allCategory = this.categories.find(x => x.key === 'all');
        this.menuItems = allCategory?.products || [];

        this.loading = false;
      },
      error: (err) => {
        console.error('Load menu failed:', err);
        this.loading = false;
      }
    });
  }

  get filteredItems(): MenuProductVm[] {
    if (this.activeCategory === 'all') {
      return this.menuItems;
    }

    const selectedCategory = this.categories.find(
      x => x.key === this.activeCategory
    );

    return selectedCategory?.products || [];
  }

  get isMenuPage(): boolean {
    return this.router.url.includes('menu');
  }

  selectCategory(categoryKey: string): void {
    this.activeCategory = categoryKey;
  }

  goToDetail(item: MenuProductVm): void {
    this.router.navigate(['/product-detail', item.slug]);
  }

  addToCart(item: MenuProductVm, event: Event): void {
    event.stopPropagation();

    if (!item?.id) {
      return;
    }

    this.cartService.addToCart({
      productId: item.id,
      quantity: 1
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.success(res.message);
        } else {
          this.toast.warning(res.message);
        }
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.toast.error(err?.error?.message || 'Thêm vào giỏ hàng thất bại');
      }
    });
  }

  formatPrice(price?: number): string {
    return ((price ?? 0).toLocaleString('vi-VN')) + 'đ';
  }

  stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
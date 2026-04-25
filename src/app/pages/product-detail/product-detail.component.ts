import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { ProductCardVm } from '../../shared/models/product-card.model';
import { ToastService } from '../../shared/services/toast.service';
import {
  ProductDetailVm,
  ProductImageVm,
  ProductUnitVm
} from '../../shared/models/product-detail.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private toast = inject(ToastService);


  slug = '';
  loading = false;
  notFound = false;

  product: ProductDetailVm | null = null;
  productCard: ProductCardVm | null = null;
  detail: ProductDetailVm | null = null;

  selectedImage = '';
  selectedUnit: ProductUnitVm | null = null;
  quantity = 1;

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    if (!this.slug) {
      this.notFound = true;
      return;
    }

    // Lấy card data từ router state khi click từ list sang
    const navState =
      this.router.getCurrentNavigation()?.extras?.state?.['productCard'] ||
      history.state?.productCard;

    if (navState) {
      this.productCard = navState as ProductCardVm;
      this.product = this.buildFallbackProduct(this.productCard);
      this.selectedImage = this.product.coverImage || '';
      this.selectedUnit = this.getDefaultUnit(this.product);
    }

    this.loadDetail();
  }

  private loadDetail(): void {
    this.loading = true;
    this.notFound = false;

    this.productService.getDetailBySlug(this.slug).subscribe({
      next: (res) => {
        this.detail = res;
        this.product = res;
        console.log("res của slug: ", res)

        const currentUnitName = this.selectedUnit?.unitName;
        this.selectedUnit =
          res.units?.find(x => x.unitName === currentUnitName) ||
          this.getDefaultUnit(res);

        const galleryImages = this.getGalleryImages(res);
        if (!this.selectedImage || !galleryImages.includes(this.selectedImage)) {
          this.selectedImage = galleryImages[0] || res.coverImage || '';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Load product detail failed:', err);
        this.loading = false;

        // Nếu không có cả fallback card lẫn detail thì coi như not found
        if (!this.product) {
          this.notFound = true;
        }
      }
    });
  }

  private buildFallbackProduct(card: ProductCardVm): ProductDetailVm {
    const fallbackUnit: ProductUnitVm[] =
      card.defaultPrice != null || card.defaultUnitName
        ? [
          {
            id: 0,
            unitName: card.defaultUnitName ?? '',
            price: card.defaultPrice ?? 0,
            stockQuantity: 0,
            isDefault: true
          }
        ]
        : [];

    return {
      id: card.id,
      name: card.name,
      origin: card.origin,
      description: '',
      categoryId: 0,
      categoryName: '',
      coverImage: card.coverImage,
      slug: card.slug,
      units: fallbackUnit,
      images: []
    };
  }

  getDefaultUnit(product: ProductDetailVm): ProductUnitVm | null {
    if (!product.units?.length) return null;
    return product.units.find(x => x.isDefault) || product.units[0];
  }

  getGalleryImages(product: ProductDetailVm): string[] {
    const childImages =
      product.images
        ?.slice()
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((x: ProductImageVm) => x.imageUrl) || [];

    return [product.coverImage, ...childImages].filter(Boolean);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectUnit(unit: ProductUnitVm): void {
    this.selectedUnit = unit;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    const maxStock = this.selectedUnit?.stockQuantity ?? 0;

    // Nếu đang là fallback card data chưa có stock thật, cứ cho tăng tối thiểu đến 99
    if (!this.detail) {
      if (this.quantity < 99) {
        this.quantity++;
      }
      return;
    }

    if (this.quantity < maxStock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get displayPrice(): number {
    return this.selectedUnit?.price ?? 0;
  }

  get displayStock(): number | string {
    if (!this.detail) return '--';
    return this.selectedUnit?.stockQuantity ?? 0;
  }

  get displayUnitName(): string {
    return this.selectedUnit?.unitName ?? '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          this.toast.error(res.message);
          return;
        }

        this.toast.success(res.message);
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Không thể thêm vào giỏ hàng, vui lòng thử lại.';

        this.toast.error(message);
      }
    });
  }

  buyNow(): void {
    if (!this.product || !this.selectedUnit) return;

    const payload = {
      productId: this.product.id,
      productName: this.product.name,
      unitName: this.selectedUnit.unitName,
      price: this.selectedUnit.price,
      quantity: this.quantity
    };

    console.log('Buy now:', payload);
  }
}
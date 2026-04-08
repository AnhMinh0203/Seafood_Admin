import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductDto, ProductImageDto, ProductUnitDto } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product: ProductDto | null = null;

  selectedImage = '';
  selectedUnit: ProductUnitDto | null = null;
  quantity = 1;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    // this.productService.getProductById(id).subscribe(res => {
    //   if (!res) {
    //     this.product = null;
    //     return;
    //   }

    //   this.product = res;
    //   this.selectedImage = this.getGalleryImages(res)[0] || res.coverImage || '';
    //   this.selectedUnit = this.getDefaultUnit(res);
    // });
  }

  getDefaultUnit(product: ProductDto): ProductUnitDto | null {
    if (!product.units?.length) return null;
    return product.units.find(x => x.isDefault) || product.units[0];
  }

  getGalleryImages(product: ProductDto): string[] {
    const childImages =
      product.images
        ?.slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(x => x.imageUrl) || [];

    const allImages = [product.coverImage, ...childImages].filter(Boolean);

    // loại bỏ duplicate nếu coverImage trùng child image
    //return [...new Set(allImages)];
    return [product.coverImage, ...childImages].filter(Boolean);

  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectUnit(unit: ProductUnitDto): void {
    this.selectedUnit = unit;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    const maxStock = this.selectedUnit?.stockQuantity ?? 0;
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

  get displayStock(): number {
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

    this.cartService.addItem({
      id: this.product.id,
      name: this.product.name,
      image: this.selectedImage || this.product.coverImage,
      price: this.displayPrice,
      quantity: this.quantity,
      meta: `${this.displayUnitName || ''}`
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
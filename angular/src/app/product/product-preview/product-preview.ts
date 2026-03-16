import { CardModule } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-product-preview',
  imports: [
    DialogModule,
    CardModule,
    TagModule,
    GalleriaModule,
    TableModule,
    DividerModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './product-preview.html',
  styleUrl: './product-preview.scss'
})
export class ProductPreview {
  @Input() product: any;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();

  galleryImages: any[] = [];
  selectedUnit: any;
  quantity: number = 1;
  phoneNumber: string = '';

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnChanges() {
    if (!this.product) return;

    const baseUrl = 'https://';

    const cover = this.product.coverImage
      ? [{
        itemImageSrc: baseUrl + this.product.coverImage,
        thumbnailImageSrc: baseUrl + this.product.coverImage
      }]
      : [];

    const children = this.product.images?.map((img: any) => ({
      itemImageSrc: baseUrl + img.imageUrl,
      thumbnailImageSrc: baseUrl + img.imageUrl
    })) || [];

    this.galleryImages = [...cover, ...children];
    this.selectedUnit = this.product?.units?.find((u: any) => u.isDefault);
  }


  onClose() {
    this.close.emit();
  }
  get defaultUnit() {
    return this.product?.units?.find((u: any) => u.isDefault);
  }

  selectUnit(unit: any) {
    this.selectedUnit = unit;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    console.log('Add to cart', {
      product: this.product,
      unit: this.selectedUnit,
      quantity: this.quantity
    });
  }

  buyNow() {
    console.log('Buy now', {
      product: this.product,
      unit: this.selectedUnit,
      quantity: this.quantity
    });
  }

  sendAdvice() {
    console.log('Phone:', this.phoneNumber);
  }
}

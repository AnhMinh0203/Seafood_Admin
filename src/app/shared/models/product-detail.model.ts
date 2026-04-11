export interface ProductUnitVm {
  id: number;
  unitName: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

export interface ProductImageVm {
  id: number;
  imageUrl: string;
  displayOrder?: number;
}

export interface ProductDetailVm {
  id: string;
  name: string;
  origin: string;
  description: string;
  categoryId: number;
  categoryName: string;
  coverImage: string;
  slug: string;
  units: ProductUnitVm[];
  images: ProductImageVm[];
}
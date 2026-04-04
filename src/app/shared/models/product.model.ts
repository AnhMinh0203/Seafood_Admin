export interface ProductUnitDto {
  unitName: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

export interface ProductImageDto {
  productId: string;
  childImage: unknown | null;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductDto {
  id: string;
  name: string;
  origin: string;
  description: string;
  categoryId: number;
  coverImage: string;
  slug: string;
  units: ProductUnitDto[];
  images: ProductImageDto[];
}
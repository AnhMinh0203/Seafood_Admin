import type { IFormFile } from '../microsoft/asp-net-core/http/models';

export interface ProductImageDto {
  productId: number;
  childImage: IFormFile;
  imageUrl?: string;
  displayOrder: number;
}

export interface ProductUnitDto {
  unitName?: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

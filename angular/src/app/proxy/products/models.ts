import type { IRemoteStreamContent } from '../volo/abp/content/models';

export interface ProductImageDto {
  productId?: string;
  childImage: IRemoteStreamContent;
  imageUrl?: string;
  displayOrder: number;
}

export interface ProductUnitDto {
  unitName?: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

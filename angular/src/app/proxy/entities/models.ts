import { EntityDto } from '@abp/ng.core';

export interface ProductUnit extends EntityDto<number> {
  productId: number;
  unitName?: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

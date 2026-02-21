import type { ProductUnit } from '../entities/models';
import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateProductDto {
  productId?: number;
  name?: string;
  origin?: string;
  description?: string;
  categoryId: number;
  coverImage: string;
  units: ProductUnitDto[];
}

export interface ProductDto extends AuditedEntityDto<number> {
  name?: string;
  origin?: string;
  description?: string;
  slug?: string;
  categoryId: number;
  coverImage?: string;
  units: ProductUnitDto[];
}

export interface ProductUnitDto {
  unitName?: string;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
}

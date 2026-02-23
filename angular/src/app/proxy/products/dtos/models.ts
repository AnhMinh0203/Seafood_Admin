import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { ProductImageDto, ProductUnitDto } from '../models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateProductDto {
  name?: string;
  coverImage: IFormFile;
  origin?: string;
  slug?: string;
  description?: string;
  categoryId: number;
  units: ProductUnitDto[];
  childImages: ProductImageDto[];
}

export interface ProductDto extends EntityDto<number> {
  name?: string;
  origin?: string;
  description?: string;
  categoryId: number;
  coverImage?: string;
  slug?: string;
  units: ProductUnitDto[];
  images: ProductImageDto[];
}

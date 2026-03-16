import type { IRemoteStreamContent } from '../../volo/abp/content/models';
import type { ProductImageDto, ProductUnitDto } from '../models';
import type { EntityDto } from '@abp/ng.core';
import type { Category } from '../../entities/models';

export interface CreateProductDto {
  name?: string;
  coverImage: File | null;
  origin?: string;
  slug?: string;
  description?: string;
  categoryId: number;
  units: ProductUnitDto[];
}

export interface ProductDto extends EntityDto<string> {
  name?: string;
  origin?: string;
  description?: string;
  categoryId: number;
  category: Category;
  coverImage: IRemoteStreamContent;
  slug?: string;
  units: ProductUnitDto[];
  images: ProductImageDto[];
}

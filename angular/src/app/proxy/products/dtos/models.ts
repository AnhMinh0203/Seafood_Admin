import type { IRemoteStreamContent } from '../../volo/abp/content/models';
import type { ProductImageDto, ProductUnitDto } from '../models';
import type { EntityDto } from '@abp/ng.core';

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
  coverImage?: string;
  slug?: string;
  units: ProductUnitDto[];
  images: ProductImageDto[];
}

export interface UpdateProductDto {
  productId?: string;
  name?: string;
  coverImage: IRemoteStreamContent;
  origin?: string;
  description?: string;
  slug?: string;
  categoryId: number;
  units: ProductUnitDto[];
}

export interface UpdateProductPayload {
  name?: string;
  coverImage?: File | null;
  origin?: string;
  description?: string;
  slug?: string;
  categoryId: number;
  units: ProductUnitDto[];
  deletedImageUrls?: string[];
}
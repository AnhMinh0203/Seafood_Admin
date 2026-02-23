import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateProductDto, ProductDto } from '../products/dtos/models';
import type { BaseResponse } from '../utils/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiName = 'Default';
  

  createByInput = (input: CreateProductDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<ProductDto>>({
      method: 'POST',
      url: '/api/app/product/Create',
      params: { name: input.name, origin: input.origin, slug: input.slug, description: input.description, categoryId: input.categoryId, units: input.units, childImages: input.childImages },
      body: input.coverImage,
    },
    { apiName: this.apiName,...config });
  

  getListWithUnitsByInput = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductDto>>({
      method: 'GET',
      url: '/api/app/product/GetListWithUnits',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

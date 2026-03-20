import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../categories/dtos/models';
import type { BaseResponse } from '../utils/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Blog';
  

  batchDeleteByIds = (ids: number[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: '/api/app/category/BatchDelete',
      body: ids,
    },
    { apiName: this.apiName,...config });
  

  createByInput = (input: CreateCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'POST',
      url: '/api/app/category/create',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deleteById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: `/api/app/category/Delete/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getListByInput = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CategoryDto>>({
      method: 'GET',
      url: '/api/app/category/getList',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateByIdAndInput = (id: number, input: UpdateCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'PUT',
      url: `/api/app/category/update/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

import { RestService, Rest, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CategoryDto } from '../categories/dtos/models';
import { BaseResponse } from 'src/app/proxy/utils';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Default';


  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CategoryDto>>({
      method: 'GET',
      url: '/api/app/category/getList',
    },
      { apiName: this.apiName, ...config });



  // CREATE
  create = (input: { name: string }, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>(
      {
        method: 'POST',
        url: '/api/app/category/create',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  // UPDATE
  update = (id: number, input: { name: string }, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>(
      {
        method: 'PUT',
        url: `/api/app/category/update/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  deleteCategory(id: number) {
    return this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: `/api/app/category/Delete/${id}`
    },
      { apiName: this.apiName });
  }

  batchDeleteCategories(ids: number[]) {
    return this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: '/api/app/category/BatchDelete',
      body: ids
    },
      { apiName: this.apiName });
  }

  constructor(private restService: RestService) { }
}

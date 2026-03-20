import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BlogDto } from '../blogs/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiName = 'Blog';
  

  getListByInput = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BlogDto>>({
      method: 'GET',
      url: '/api/app/blog/getList',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

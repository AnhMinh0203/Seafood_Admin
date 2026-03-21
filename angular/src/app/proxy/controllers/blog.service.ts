import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BlogDto, CreateBlogDto, UpdateBlogDto } from '../blogs/dtos/models';
import { BaseResponse } from 'src/app/proxy/utils/models';

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
      { apiName: this.apiName, ...config });


  createBlog(input: CreateBlogDto) {
    const formData = new FormData();
    formData.append('title', input.title || '');
    formData.append('content', input.content || '');
    if (input.coverImage) {
      formData.append('coverImage', input.coverImage);
    }
    return this.restService.request<any, BaseResponse<CreateBlogDto>>({
      method: 'POST',
      url: '/api/app/blog/Create',
      body: formData
    },
      { apiName: this.apiName });
  }

  updateBlog(itemId: number, input: UpdateBlogDto) {
    const formData = new FormData();
    formData.append('title', input.title || '');
    formData.append('content', input.content || '');
    if (input.coverImage) {
      formData.append('coverImage', input.coverImage);
    }

    return this.restService.request<any, BaseResponse<BlogDto>>({
      method: 'PUT',
      url: `/api/app/blog/Update/${itemId}`,
      body: formData
    }, {
      apiName: this.apiName
    });
  }

  constructor(private restService: RestService) { }
}

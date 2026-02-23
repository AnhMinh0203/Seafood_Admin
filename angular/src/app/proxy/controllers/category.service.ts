import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Default';
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'GET',
      url: '/api/app/category/getList',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

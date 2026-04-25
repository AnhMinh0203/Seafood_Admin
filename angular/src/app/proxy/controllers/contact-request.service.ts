import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';


import type { BaseResponse } from 'src/app/proxy/utils/models';
import { ContactRequestDto, CreateContactRequestDto } from '../contacts/dtos';

@Injectable({
  providedIn: 'root',
})
export class ContactRequestService {
  apiName = 'Default';

  constructor(private restService: RestService) { }

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContactRequestDto[]>(
      {
        method: 'GET',
        url: '/api/app/contact-request',
      },
      { apiName: this.apiName, ...config }
    );

  getById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContactRequestDto>(
      {
        method: 'GET',
        url: `/api/app/contact-request/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateContactRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<any>>(
      {
        method: 'POST',
        url: '/api/app/contact-request',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/contact-request/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  batchDelete = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<boolean>>(
      {
        method: 'POST',
        url: '/api/app/contact-request/batch-delete',
        body: ids,
      },
      { apiName: this.apiName, ...config }
    );

  updateStatus = (id: string, status: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<boolean>>(
      {
        method: 'PUT',
        url: `/api/app/contact-request/${id}/status`,
        params: { status },
      },
      { apiName: this.apiName, ...config }
    );

  batchApprove = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<boolean>>(
      {
        method: 'POST',
        url: '/api/app/contact-request/batch-approve',
        body: ids,
      },
      { apiName: this.apiName, ...config }
    );
}
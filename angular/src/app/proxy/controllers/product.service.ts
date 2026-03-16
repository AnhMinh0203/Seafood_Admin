import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { CreateProductDto, ProductDto } from '../products/dtos/models';
import type { BaseResponse } from '../utils/models';
import { IRemoteStreamContent } from 'src/app/proxy/volo/abp/content/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiName = 'Default';

  createProduct(input: CreateProductDto, childImages: File[]) {

    const formData = new FormData();

    // ===== Input fields =====
    formData.append('name', input.name || '');
    formData.append('origin', input.origin || '');
    formData.append('slug', input.slug || '');
    formData.append('description', input.description || '');
    formData.append('categoryId', input.categoryId.toString());

    // Units (vì multipart không bind List object tốt)
    input.units.forEach((unit, index) => {
      formData.append(`Units[${index}].UnitName`, unit.unitName || '');
      formData.append(`Units[${index}].Price`, unit.price?.toString() || '0');
      formData.append(`Units[${index}].StockQuantity`, unit.stockQuantity?.toString() || '0');
      formData.append(`Units[${index}].IsDefault`, unit.isDefault.toString());
    });

    // Cover
    if (input.coverImage) {
      formData.append('coverImage', input.coverImage);
    }

    // Child images
    childImages.forEach(file => {
      formData.append('childImages', file);
    });

    return this.restService.request<any, BaseResponse<ProductDto>>({
      method: 'POST',
      url: '/api/app/product/Create',
      body: formData
    },
      { apiName: this.apiName });
  }

  updateProduct(id: string, input: CreateProductDto, childImages: File[]) {

    const formData = new FormData();

    // ===== Input fields =====
    formData.append('name', input.name || '');
    formData.append('origin', input.origin || '');
    formData.append('slug', input.slug || '');
    formData.append('description', input.description || '');
    formData.append('categoryId', input.categoryId.toString());

    // ===== Units =====
    input.units.forEach((unit, index) => {
      formData.append(`Units[${index}].UnitName`, unit.unitName || '');
      formData.append(`Units[${index}].Price`, unit.price?.toString() || '0');
      formData.append(`Units[${index}].StockQuantity`, unit.stockQuantity?.toString() || '0');
      formData.append(`Units[${index}].IsDefault`, unit.isDefault.toString());
    });

    // ===== Cover (chỉ gửi nếu có file mới) =====
    if (input.coverImage instanceof File) {
      formData.append('coverImage', input.coverImage);
    }

    // ===== Child images (chỉ là ảnh mới thêm) =====
    childImages.forEach(file => {
      formData.append('childImages', file);
    });

    return this.restService.request<any, BaseResponse<ProductDto>>({
      method: 'PUT',
      url: `/api/app/product/Update/${id}`,
      body: formData
    },
      { apiName: this.apiName });
  }


  getListWithUnitsByInput = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductDto>>({
      method: 'GET',
      url: '/api/app/product/GetListWithUnits',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
      { apiName: this.apiName, ...config });

  getProductById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaseResponse<ProductDto>>({
      method: 'GET',
      url: `/api/app/product/GetDetail/${id}`,
    },
      { apiName: this.apiName, ...config });

  deleteProduct(id: string) {
    return this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: `/api/app/product/${id}`
    },
      { apiName: this.apiName });
  }

  batchDeleteProducts(ids: string[]) {
    return this.restService.request<any, BaseResponse<boolean>>({
      method: 'DELETE',
      url: '/api/app/product/BatchDelete',
      body: ids
    },
      { apiName: this.apiName });
  }

  constructor(private restService: RestService, private http: HttpClient) { }
}

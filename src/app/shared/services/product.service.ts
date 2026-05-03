import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCardVm } from '../models/product-card.model';
import { ProductDetailVm } from '../models/product-detail.model';
import { PagedResultDto } from '../models/base.model';



@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly baseUrl = '/api/app/product';

    constructor(private http: HttpClient) { }

    getPagedCards(request: {
        skipCount: number;
        maxResultCount: number;
        sorting?: string;
    }): Observable<PagedResultDto<ProductCardVm>> {
        const params = new HttpParams()
            .set('Sorting', request.sorting ?? '')
            .set('SkipCount', request.skipCount.toString())
            .set('MaxResultCount', request.maxResultCount.toString());

        return this.http.get<PagedResultDto<ProductCardVm>>(
            `${this.baseUrl}/paged-cards`,
            { params }
        );
    }

    getDetailBySlug(slug: string): Observable<ProductDetailVm> {
        const params = new HttpParams().set('slug', slug);
        return this.http.get<ProductDetailVm>(
            `${this.baseUrl}/detail-by-slug`,
            { params }
        );
    }

    getDetailById(id: string): Observable<ProductDetailVm> {
        const params = new HttpParams().set('productId', id);
        return this.http.get<ProductDetailVm>(
            `${this.baseUrl}/GetDetail`,
            { params }
        );
    }
}
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PagedResultDto, ProductDto } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCardVm } from '../models/product-card.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly baseUrl = `/api/app/product`;

    constructor(private http: HttpClient) { }

    getProducts(skipCount: number, maxResultCount: number, sorting: string): Observable<ProductCardVm[]> {
        const params = new HttpParams()
            .set('Sorting', sorting ?? '')
            .set('SkipCount', skipCount.toString())
            .set('MaxResultCount', maxResultCount.toString());

        return this.http
            .get<PagedResultDto<ProductDto>>(`${this.baseUrl}/GetListWithUnits`, { params })
            .pipe(
                map(response => response.items.map(item => this.mapToCardVm(item)))
            );
    }

    // getProductById(id: string): Observable<ProductDto | undefined> {
    //     return of(this.products.find(x => x.id === id));
    // }

    private mapToCardVm(item: ProductDto): ProductCardVm {
        const defaultUnit =
            item.units?.find(x => x.isDefault) ||
            item.units?.[0];

        return {
            id: item.id,
            name: item.name,
            image: item.coverImage,
            price: defaultUnit?.price ?? 0,
            weight: defaultUnit?.unitName ?? '',
            isFavorite: false,
            origin: item.origin,
            slug: item.slug
        };
    }
}
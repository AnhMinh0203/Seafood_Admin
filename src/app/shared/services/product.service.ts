import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductDto } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: ProductDto[] = [
        {
            id: '1',
            name: 'Hàu sữa Quan Lạn',
            origin: 'Quảng Ninh, Việt Nam',
            description: `
            <p>Hàu sữa Quan Lạn tươi sống, thịt béo, vị ngọt tự nhiên, giàu kẽm và khoáng chất.</p>
            <p>Sản phẩm thích hợp để nướng mỡ hành, hấp sả, nấu cháo hoặc ăn kèm sốt chanh.</p>
            <ul>
            <li>Hàu được tuyển chọn mỗi ngày</li>
            <li>Bảo quản lạnh tiêu chuẩn</li>
            <li>Phù hợp cho bữa ăn gia đình và nhà hàng</li>
            </ul>
        `,
            categoryId: 1,
            coverImage: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
            slug: 'hau-sua-quan-lan',
            units: [
                {
                    unitName: '1 kg',
                    price: 189000,
                    stockQuantity: 25,
                    isDefault: true
                },
                {
                    unitName: 'Hộp 500g',
                    price: 99000,
                    stockQuantity: 18,
                    isDefault: false
                },
                {
                    unitName: 'Combo 2 kg',
                    price: 360000,
                    stockQuantity: 10,
                    isDefault: false
                }
            ],
            images: [
                {
                    productId: '1',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 0
                },
                {
                    productId: '2',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 1
                },
                {
                    productId: '3',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 2
                },
                {
                    productId: '4',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 3
                },
                {
                    productId: '5',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 4
                },
                                {
                    productId: '6',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 4
                },                {
                    productId: '7',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 4
                },                {
                    productId: '8',
                    childImage: null,
                    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
                    displayOrder: 4
                },                
            ]
        }
    ];

    getProducts(): Observable<ProductDto[]> {
        return of(this.products);
    }

    getProductById(id: string): Observable<ProductDto | undefined> {
        return of(this.products.find(x => x.id === id));
    }
}
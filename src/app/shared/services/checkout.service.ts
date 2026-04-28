import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/base.model';

export interface CheckoutRequest {
    customer: {
        fullName: string | null | undefined;
        phoneNumber: string | null | undefined;
        address: string | null | undefined;
        note?: string | null | undefined;
    };
    paymentMethod: 'COD' | 'VNPAY';
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
}

export interface CheckoutResult {
    orderId: string;
    paymentMethod: 'COD' | 'VNPAY';
    redirectUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    private http = inject(HttpClient);
    private readonly baseUrl = '/api/app/order';
    checkout(payload: CheckoutRequest): Observable<BaseResponse<CheckoutResult>> {
        return this.http.post<BaseResponse<CheckoutResult>>(
            `${this.baseUrl}/checkout`,
            payload
        );
    }
}
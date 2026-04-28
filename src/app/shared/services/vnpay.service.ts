import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { VnPayCreatePaymentRequest } from '../models/vnpay.model';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class VnPayService {
  private readonly baseUrl = '/api/app/vnpay';

  constructor(private http: HttpClient) {}

  createPaymentUrl(payload: VnPayCreatePaymentRequest): Observable<string> {
    return this.http
      .post<BaseResponse<string>>(`${this.baseUrl}/create-payment-url`, payload)
      .pipe(
        map((res) => {
          /**
           * Backend hiện tại trả URL ở message:
           * {
           *   isSuccess: true,
           *   message: "https://sandbox.vnpayment.vn/...",
           *   null
           * }
           *
           * Nếu sau này sửa backend trả URL ở data thì đoạn này vẫn support.
           */
          return res?.data || res?.message;
        })
      );
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateContactRequestDto } from '../models/contact-request.model';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class ContactRequestService {
  private readonly baseUrl = '/api/app/contact-request';

  constructor(private http: HttpClient) {}

  create(input: CreateContactRequestDto): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(this.baseUrl, input);
  }
}
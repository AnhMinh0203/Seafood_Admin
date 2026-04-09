import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '../models/auth.model';
import { BaseResponse } from '../models/base.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = '/api/app/user';

  constructor(private http: HttpClient) {}

  // ✅ REG ISTER
  register(input: RegisterDto): Observable<BaseResponse<RegisterResponseDto>> {
    return this.http.post<BaseResponse<RegisterResponseDto>>(
      `${this.baseUrl}/create`,
      input
    );
  }

  // ✅ LOGIN (bạn cần có API BE tương ứng)
  login(input: LoginDto): Observable<BaseResponse<LoginResponseDto>> {
    return this.http.post<BaseResponse<LoginResponseDto>>(
      `${this.baseUrl}/login`,
      input
    );
  }

  // ✅ Lưu token
  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  // ✅ Lấy token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('access_token');
  }
}

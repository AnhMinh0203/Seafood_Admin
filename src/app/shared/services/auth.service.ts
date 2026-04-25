import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto
} from '../models/auth.model';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = '/api/app/user';
  private readonly storageKey = 'current_user';

  private readonly _currentUser = signal<LoginResponseDto | null>(this.getStoredUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());

  constructor(private http: HttpClient) { }

  register(input: RegisterDto): Observable<BaseResponse<RegisterResponseDto>> {
    return this.http.post<BaseResponse<RegisterResponseDto>>(
      `${this.baseUrl}/register`,
      input
    );
  }

  login(input: LoginDto): Observable<BaseResponse<LoginResponseDto>> {
    return this.http.post<BaseResponse<LoginResponseDto>>(
      `${this.baseUrl}/login`,
      input,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.setCurrentUser(res.data);
        }
      })
    );
  }

  logout(): void {
    this.clearCurrentUser();
  }

  getMyProfile(): Observable<BaseResponse<LoginResponseDto>> {
    return this.http.get<BaseResponse<LoginResponseDto>>(
      `${this.baseUrl}/my-profile`,
      { withCredentials: true }
    );
  }

  syncCurrentUser(): Observable<boolean> {
    return this.getMyProfile().pipe(
      map((res) => {
        if (res.isSuccess && res.data) {
          this.setCurrentUser(res.data);
          return true;
        }

        this.clearCurrentUser();
        return false;
      }),
      catchError(() => {
        this.clearCurrentUser();
        return of(false);
      })
    );
  }

  setCurrentUser(user: LoginResponseDto): void {
    this._currentUser.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private getStoredUser(): LoginResponseDto | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as LoginResponseDto;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
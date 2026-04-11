import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/app/user';
  
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<BaseResponse<UserProfile>> {
    return this.http.get<BaseResponse<UserProfile>>(
      `${this.baseUrl}/my-profile`,
      {
        withCredentials: true
      }
    );
  }

  updateMyProfile(input: UserProfile): Observable<BaseResponse<UserProfile>> {
    return this.http.put<BaseResponse<UserProfile>>(
      `${this.baseUrl}/my-profile`,
      input,
      {
        withCredentials: true
      }
    );
  }
}
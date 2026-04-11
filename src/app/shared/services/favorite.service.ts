import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FavoriteProductVm, ToggleFavoriteResultVm } from '../models/favorite.model';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly baseUrl = '/api/app/favorite';

  constructor(private http: HttpClient) {}

  add(productId: string): Observable<ToggleFavoriteResultVm> {
    return this.http.post<ToggleFavoriteResultVm>(
      `${this.baseUrl}/${productId}`,
      {}
    );
  }

  remove(productId: string): Observable<ToggleFavoriteResultVm> {
    return this.http.delete<ToggleFavoriteResultVm>(
      `${this.baseUrl}/${productId}`
    );
  }

  toggle(productId: string): Observable<ToggleFavoriteResultVm> {
    return this.http.post<ToggleFavoriteResultVm>(
      `${this.baseUrl}/toggle/${productId}`,
      {}
    );
  }

  isFavorite(productId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/is-favorite/${productId}`
    );
  }

  getMyFavorites(): Observable<FavoriteProductVm[]> {
    return this.http.get<FavoriteProductVm[]>(
      `${this.baseUrl}/my-favorites`
    );
  }
}
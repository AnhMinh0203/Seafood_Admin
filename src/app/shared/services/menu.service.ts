import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuPageVm } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly baseUrl = '/api/app/menu';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuPageVm> {
    return this.http.get<MenuPageVm>(`${this.baseUrl}/get-menu`);
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedAndSortedResultRequestDto, PagedResultDto } from '../models/base.model';
import { BlogDto } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly baseUrl = '/api/app/blog';

  constructor(private http: HttpClient) {}


  getList(input: PagedAndSortedResultRequestDto): Observable<PagedResultDto<BlogDto>> {
    let params = new HttpParams();

    if (input.skipCount != null) {
      params = params.set('skipCount', input.skipCount);
    }

    if (input.maxResultCount != null) {
      params = params.set('maxResultCount', input.maxResultCount);
    }

    if (input.sorting) {
      params = params.set('sorting', input.sorting);
    }

    return this.http.get<PagedResultDto<BlogDto>>(`${this.baseUrl}/getList`, { params });
  }

  getDetail(id: number): Observable<BlogDto> {
    const params = new HttpParams().set('iteamId', id);
    return this.http.get<BlogDto>(`${this.baseUrl}/getDetail`,{ params });
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookResponse } from './book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  readonly endpoint: string = '/books';

  constructor(private http: HttpClient) {}

  getBooks(params: any): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(this._buildEndpoint(params));
  }

  private _buildEndpoint(params: any): string {
    return environment.baseURL + `${this.endpoint}?page=${params['page']}&limit=${params['limit']}&sort=${params['sort']}`;
  }
}

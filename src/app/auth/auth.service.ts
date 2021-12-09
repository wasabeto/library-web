import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly endpoint: string = '/auth';
  readonly AUTH_INFO_KEY: string = 'AUTH_INFO';
  private currentAuthDataSubject: BehaviorSubject<AuthData>;
  public currentUser: Observable<AuthData>;

  constructor(private http: HttpClient) {
    const storedInfo = window.localStorage.getItem(this.AUTH_INFO_KEY);
    this.currentAuthDataSubject = new BehaviorSubject<AuthData>(storedInfo ? JSON.parse(storedInfo) : '');
    this.currentUser = this.currentAuthDataSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Basic ${btoa(email + ':' + password)}`);
    return this.http.post(this._buildEndpoint(), { access_token: environment.masterKey }, { headers: headers }).pipe(
      map((response: any) => {
        window.localStorage.setItem(this.AUTH_INFO_KEY, JSON.stringify(response));
        this.currentAuthDataSubject.next(response);
        return response['user'];
      }),
      catchError((error: any) => {
        const { status, message, statusText } = error;
        if (status) {
          return of(message);
        }
        return of(statusText);
      })
    );
  }

  logout(): void {
    window.localStorage.removeItem(this.AUTH_INFO_KEY);
    this.currentAuthDataSubject.next({ token: '' });
  }

  private _buildEndpoint(): string {
    return environment.baseURL + this.endpoint;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, RegisterFormData, User } from '../../auth/interfaces/auth.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  user = computed(() => this._user());
  token = computed(this._token);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`, { headers }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  register(userData: RegisterFormData): Observable<boolean> {
    const url = `${BASE_URL}/auth/register`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((err) => throwError(() => err.error.message)),
    );
  }
}

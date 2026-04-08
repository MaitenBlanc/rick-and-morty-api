import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, RegisterFormData, User } from '../../auth/interfaces/auth.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, map, catchError, of, throwError, tap, switchMap } from 'rxjs';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>(
    localStorage.getItem('token') ? 'authenticated' : 'not-authenticated',
  );
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  user = computed(() => this._user());
  token = computed(this._token);
  authStatus = computed(() => this._authStatus());

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, { email, password }).pipe(
      tap((resp) => {
        localStorage.setItem('token', resp.token);
        this.handleAuthSuccess(resp); // Guardar info user y token
      }),
      switchMap(() => this.checkStatus()),
      map(() => true),
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  register(userData: RegisterFormData): Observable<boolean> {
    const url = `${BASE_URL}/auth/register`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((err) => throwError(() => err.error.message)),
    );
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

  updateProfile(userId: string, data: Partial<User>): Observable<User> {
    const url = `${BASE_URL}/auth/update/${userId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, data, { headers }).pipe(
      tap((updatedUser) => {
        // para que el perfil haga refresh
        this._user.set(updatedUser);
        // actualizo el localStorage para persistir el cambio
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }),
      catchError((err) => {
        console.error('Error:', err);
        return throwError(() => err);
      }),
    );
  }
}

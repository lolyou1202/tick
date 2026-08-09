import { Injectable, signal, computed, inject } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, tap, catchError, throwError, map, of } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { AuthResponse, User } from './auth.model'
import { API_BASE_URL, AUTH_TOKEN_COOKIE } from '../config/tokens'
import { AuthError } from './auth.errors'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient)
  private readonly _cookie = inject(CookieService)
  private readonly _apiBaseUrl = inject(API_BASE_URL)
  private readonly _authTokenCookie = inject(AUTH_TOKEN_COOKIE)

  private readonly _user = signal<User | null>(null)
  private readonly _authToken = signal<string | null>(
    this._getTokenFromCookie()
  )

  public readonly isAuthenticated = computed(() => !!this._user())
  public readonly user = this._user.asReadonly()
  public readonly authToken = this._authToken.asReadonly()

  public register({
    userName,
    email,
    password
  }: {
    userName: string
    email: string
    password: string
  }): Observable<boolean> {
    return this._http
      .post<AuthResponse>(`${this._apiBaseUrl}/register`, {
        email,
        password,
        userName
      })
      .pipe(
        map(() => true),
        catchError((err: HttpErrorResponse) => {
          if (
            err.status === 401 &&
            err.error.message === 'RESOURCE_USER_ALREADY_EXISTS'
          ) {
            return throwError(() => new AuthError('user_exists'))
          }
          if (err.status === 403) {
            return throwError(() => new AuthError('server'))
          }
          return throwError(() => new AuthError('unknown_registration'))
        })
      )
  }

  public login({
    email,
    password
  }: {
    email: string
    password: string
  }): Observable<boolean> {
    return this._http
      .post<AuthResponse>(`${this._apiBaseUrl}/auth`, {
        email,
        password
      })
      .pipe(
        tap(res => {
          this._setSession(res)
        }),
        map(() => true),
        catchError((err: HttpErrorResponse) => {
          if (
            err.status === 401 &&
            err.error.message === 'RESOURCE_INVALID_LOGIN_OR_PASSWORD'
          ) {
            return throwError(() => new AuthError('invalid_credentials'))
          }
          if (err.status === 403) {
            return throwError(() => new AuthError('server'))
          }
          return throwError(() => new AuthError('unknown_login'))
        })
      )
  }

  public checkAuth(): Observable<User | null> {
    return this._http.get<User>(`${this._apiBaseUrl}/auth_me`).pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._clearSession()
        return of(null)
      })
    )
  }

  public logout(): void {
    this._clearSession()
  }

  private _setSession(authResult: AuthResponse): void {
    this._cookie.set(this._authTokenCookie, authResult.token, {
      expires: 7, // дней
      secure: true, // только по HTTPS
      sameSite: 'Strict', // защита от CSRF
      path: '/'
    })
    this._authToken.set(authResult.token)
    this._user.set(authResult.data)
  }

  private _clearSession(): void {
    this._cookie.delete(this._authTokenCookie, '/')
    this._authToken.set(null)
    this._user.set(null)
  }

  private _getTokenFromCookie(): string | null {
    return this._cookie.get(this._authTokenCookie) || null
  }
}

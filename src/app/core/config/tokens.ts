import { InjectionToken } from '@angular/core'

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: (): string => 'https://1cb88bb89cb8d4dc.mokky.dev'
})

export const AUTH_TOKEN_COOKIE = new InjectionToken<string>(
  'AUTH_TOKEN_COOKIE',
  {
    providedIn: 'root',
    factory: (): string => 'auth_token'
  }
)

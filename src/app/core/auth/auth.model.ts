export interface User {
  id: number
  email: string
  userName: string
}

export interface AuthResponse {
  token: string
  data: User
}

export type AuthErrorKind =
  | 'user_exists'
  | 'invalid_credentials'
  | 'unknown_registration'
  | 'unknown_login'

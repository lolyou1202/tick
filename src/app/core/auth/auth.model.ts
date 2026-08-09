export interface User {
  id: number
  email: string
  userName: string
}

export interface AuthResponse {
  token: string
  data: User
}
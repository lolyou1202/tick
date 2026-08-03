import { AuthErrorKind } from './auth.model'

export class AuthError extends Error {
  constructor(public kind: AuthErrorKind) {
    super(API_ERROR_MESSAGES[kind])
    this.name = 'AuthError'
  }
}

const API_ERROR_MESSAGES: Record<AuthErrorKind, string> = {
  user_exists: 'Пользователь с таким e-mail уже существует',
  invalid_credentials: 'Неверный логин или пароль',
  unknown_registration: 'Произошла ошибка при регистрации',
  unknown_login: 'Произошла ошибка при входе'
}

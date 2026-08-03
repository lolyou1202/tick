import { inject, Injectable, signal } from '@angular/core'
import { Router } from '@angular/router'
import {
  form,
  required,
  email,
  minLength,
  maxLength,
  pattern
} from '@angular/forms/signals'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../../../core/auth/auth.service'
import { AuthError } from '../../../core/auth/auth.errors'

@Injectable({ providedIn: 'root' })
export class RegisterFormFactory {
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)

  public readonly registerForm = form(
    signal({
      userName: '',
      email: '',
      password: ''
    }),
    schema => {
      required(schema.userName, {
        error: {
          kind: 'formError',
          message: 'Псевдоним должен быть введён'
        }
      })
      minLength(schema.userName, 3, {
        error: {
          kind: 'formError',
          message: 'Псевдоним должен содержать не менее 3 символов'
        }
      })
      maxLength(schema.userName, 40, {
        error: {
          kind: 'formError',
          message: 'Псевдоним должен содержать не более 40 символов'
        }
      })
      pattern(schema.userName, /^[A-Za-zА-Яа-яЁё ]+$/, {
        error: {
          kind: 'formError',
          message:
            'Псевдоним должен содержать только буквы и пробелы без спецсимволов'
        }
      })
      email(schema.email, {
        error: {
          kind: 'formError',
          message: 'Неправильный формат e-mail'
        }
      })
      required(schema.email, {
        error: {
          kind: 'formError',
          message: 'E-mail адрес должен быть введён'
        }
      })
      minLength(schema.email, 6, {
        error: {
          kind: 'formError',
          message: 'E-mail адрес должен содержать не менее 6 символов'
        }
      })
      maxLength(schema.email, 40, {
        error: {
          kind: 'formError',
          message: 'E-mail адрес должен содержать не более 40 символов'
        }
      })
      required(schema.password, {
        error: {
          kind: 'formError',
          message: 'Пароль должен быть введён'
        }
      })
      minLength(schema.password, 6, {
        error: {
          kind: 'formError',
          message: 'Пароль должен содержать не менее 6 символов'
        }
      })
      maxLength(schema.password, 40, {
        error: {
          kind: 'formError',
          message: 'Пароль должен содержать не более 40 символов'
        }
      })
      pattern(schema.password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        error: {
          kind: 'formError',
          message:
            'Пароль должен содержать только буквы и цифры без спецсимволов'
        }
      })
    },
    {
      submission: {
        action: async field => {
          const { userName, email, password } = field().value()
          try {
            await firstValueFrom(
              this._authService.register({
                userName: userName.replace('  ', ' ').trim(),
                email,
                password
              })
            )
            await this._router.navigate(['/login'])
            return
          } catch (error) {
            if (error instanceof AuthError) {
              switch (error.kind) {
                case 'user_exists':
                  return {
                    kind: 'formError',
                    message: error.message,
                    fieldTree: field.email
                  }
                default:
                  return {
                    kind: 'serverError',
                    message: error.message
                  }
              }
            }
            return {
              kind: 'serverError',
              message: new AuthError('unknown_registration').message
            }
          }
        }
      }
    }
  )
}

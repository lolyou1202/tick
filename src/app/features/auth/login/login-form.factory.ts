import { inject, Injectable, signal } from '@angular/core'
//import { Router } from '@angular/router'
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
export class LoginFormFactory {
  private readonly _authService = inject(AuthService)
  //private readonly _router = inject(Router)

  public readonly loginForm = form(
    signal({
      email: '',
      password: ''
    }),
    schema => {
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
          const { email, password } = field().value()
          try {
            await firstValueFrom(
              this._authService.login({
                email,
                password
              })
            )
            //await this._router.navigate(['/tasks'])
            return
          } catch (error) {
            if (error instanceof AuthError) {
              return {
                kind: 'serverError',
                message: error.message
              }
            }
            return {
              kind: 'serverError',
              message: new AuthError('unknown_login').message
            }
          }
        }
      }
    }
  )
}

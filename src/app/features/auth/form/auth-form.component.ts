import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input
} from '@angular/core'
import { FormField, FormRoot } from '@angular/forms/signals'
import { LoginFormFactory } from '../login/login-form.factory'
import { RegisterFormFactory } from '../register/register-form.factory'
import DefaultInputComponent from '../../../shared/ui/default-input/default-input.component'
import { DefaultButtonComponent } from '../../../shared/ui/default-button/default-button.component'

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  imports: [FormRoot, FormField, DefaultInputComponent, DefaultButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthFormComponent {
  private readonly _loginFormFactory = inject(LoginFormFactory)
  private readonly _registerFormFactory = inject(RegisterFormFactory)

  protected loginForm = this._loginFormFactory.loginForm
  protected registerForm = this._registerFormFactory.registerForm

  public mode = input.required<'login' | 'register'>()

  protected isLogin = computed(() => this.mode() === 'login')
  protected form = computed(() =>
    this.isLogin() ? this.loginForm : this.registerForm
  )
  protected formSubmitting = computed(() => this.form()().submitting())
  protected formErrors = computed(() => this.form()().errors())
  protected submitLabel = computed(() => {
    const label = this.isLogin() ? 'Войти' : 'Зарегистрироваться'
    return this.formSubmitting() ? 'Подождите...' : label
  })

  constructor() {
    effect(() => {
      if (this.isLogin()) {
        this.loginForm().reset({ email: '', password: '' })
      } else {
        this.registerForm().reset({ userName: '', email: '', password: '' })
      }
    })
  }
}

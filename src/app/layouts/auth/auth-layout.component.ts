import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core'
import AuthFormComponent from '../../features/auth/form/auth-form.component'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  imports: [AuthFormComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthLayoutComponent {
  public mode = input.required<'login' | 'register'>()

  protected isLogin = computed(() => this.mode() === 'login')
  protected formTitle = computed(() =>
    this.isLogin() ? 'Вход' : 'Регистрация'
  )

  protected authQuestionLabel = computed(() =>
    this.isLogin() ? 'Вы еще не зарегистрированы?' : 'Уже есть аккаунт?'
  )

  protected authLink = computed(() => (this.isLogin() ? '/register' : '/login'))

  protected authLinkLabel = computed(() =>
    this.isLogin() ? 'Зарегистрироваться' : 'Войти'
  )
}

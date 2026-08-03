import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { LoginFormFactory } from '../../features/auth/login/login-form.factory'
import { FormField, FormRoot } from '@angular/forms/signals'

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [FormRoot, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
  private readonly _formFactory = inject(LoginFormFactory)

  protected loginForm = this._formFactory.loginForm
}

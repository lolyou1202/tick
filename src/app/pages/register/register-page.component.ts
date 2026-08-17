import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RegisterFormFactory } from '../../features/auth/register/register-form.factory'
import AuthLayoutComponent from '../../layouts/auth/auth-layout.component'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  imports: [AuthLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterPageComponent {
  private readonly _formFactory = inject(RegisterFormFactory)

  protected registerForm = this._formFactory.registerForm
}

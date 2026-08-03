import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormRoot, FormField } from '@angular/forms/signals'
import { RegisterFormFactory } from '../../features/auth/register/register-form.factory'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  imports: [FormRoot, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterPageComponent {
  private readonly _formFactory = inject(RegisterFormFactory)

  protected registerForm = this._formFactory.registerForm
}

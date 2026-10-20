import { ChangeDetectionStrategy, Component } from '@angular/core'
import AuthLayoutComponent from '../../layouts/auth/auth-layout.component'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  imports: [AuthLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterPageComponent {}

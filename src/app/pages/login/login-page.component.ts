import { ChangeDetectionStrategy, Component } from '@angular/core'
import AuthLayoutComponent from '../../layouts/auth/auth-layout.component'

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [AuthLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {}

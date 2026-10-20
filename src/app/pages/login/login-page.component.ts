import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import AuthLayoutComponent from '../../layouts/auth/auth-layout.component'
import { ModalService } from '../../shared/ui/modal/modal.service'
import AuthFormComponent from '../../features/auth/form/auth-form.component'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [AuthLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginPageComponent {
  protected readonly modalService = inject(ModalService)

  protected onClickButton(event: PointerEvent): void {
    const target = event.target as HTMLElement

    this.modalService.open({
      component: AuthFormComponent,
      componentInputs: {
        mode: 'login'
      },
      config: {
        customPositionStrategy: {
					origin: target,
					position: 'bottom-right'
				},
        closeOnBackdropClick: true,
        closeOnEsc: true,
        animationDuration: 500,
        darkBackdrop: false
      }
    })
  }
}

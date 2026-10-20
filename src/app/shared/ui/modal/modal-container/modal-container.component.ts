import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  Type
} from '@angular/core'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { A11yModule } from '@angular/cdk/a11y'

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
  imports: [NgComponentOutlet, NgTemplateOutlet, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent {
  //protected readonly overlayRef = inject<OverlayRef>(OVERLAY_REF)

  public readonly contentComponent = input<Type<unknown>>()
  public readonly contentTemplate = input<TemplateRef<unknown>>()
  public readonly contentComponentInputs = input<Record<string, unknown>>()
}

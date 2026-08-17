import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'

import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent]
})
export class DefaultButtonComponent {
  public readonly type = input<'reset' | 'submit' | 'button'>('button')
  public readonly variant = input<'filled' | 'outlined'>('filled')
  public readonly width = input<'default' | 'full-width'>('default')
  public readonly size = input<'sm' | 'md' | 'lg'>('md')
  public readonly label = input<string>()
  public readonly iconName = input<string>()
  public readonly disabled = input<boolean>()

  public clicked = output<void>()

  public onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit()
    }
  }
}

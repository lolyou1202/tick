import { Component, input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    '[style.--icon-size]': 'size()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  public name = input.required<string>()
  public size = input<string>()
}

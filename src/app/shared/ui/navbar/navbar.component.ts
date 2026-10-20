import { ChangeDetectionStrategy, Component } from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { RouterLink, RouterLinkActive } from '@angular/router'

type MainNavItem = {
  icon: string
  link: string
}

type SecondaryNavItem = {
  icon: string
  handler: () => void
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class NavbarComponent {
  public readonly mainNavItems: MainNavItem[] = [
    { icon: 'eye', link: '/tasks' },
    { icon: 'eye', link: '/calendar' },
    { icon: 'eye', link: '/habits' }
  ]

  public readonly secondaryNavItems: SecondaryNavItem[] = [
    { icon: 'eye', handler: this.onClickInfo },
    { icon: 'eye', handler: this.onClickSearch }
  ]

  protected onClickInfo(): void {}
  protected onClickSearch(): void {}
}

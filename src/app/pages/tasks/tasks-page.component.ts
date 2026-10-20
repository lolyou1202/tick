import { ChangeDetectionStrategy, Component } from '@angular/core'
import MainLayoutComponent from '../../layouts/main/main-layout.component'

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  imports: [MainLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TasksPageComponent {}

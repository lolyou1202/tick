import { Routes } from '@angular/router'
import { authGuard } from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page.component')
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register-page.component')
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/tasks-page.component')
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/tasks-page.component')
  },
  {
    path: 'habits',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/tasks-page.component')
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
]

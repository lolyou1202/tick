import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { map, catchError, of } from 'rxjs'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated()) {
    return true
  }

  return authService.checkAuth().pipe(
    map(user => {
      if (user) {
        return true
      }
      return router.createUrlTree(['/login'])
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']))
    })
  )
}

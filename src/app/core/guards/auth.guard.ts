import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @param route Snapshot de la ruta a la que se intenta acceder.
 * @param state Estado del router en el momento de la navegación.
 * @returns `true` para permitir el acceso; `false` para denegarlo (y redirigir al login).
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtenemos el valor actual de la sesión.
  const currentUser = authService.currentUserValue;

  if (currentUser) {
    // Si hay un usuario (sea normal o admin), permite el acceso.
    return true;
  }

  // Si no hay sesión, redirige a la página de login y deniega el acceso.
  router.navigate(['/auth/login']);
  return false;
};

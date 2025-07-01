import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
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

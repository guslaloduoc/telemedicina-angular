import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.tipo === 'admin') {
    // Si el usuario está logueado y es admin, permite el acceso.
    return true;
  }

  // Si no, redirige a la página de inicio y deniega el acceso.
  router.navigate(['/home']);
  return false;
};

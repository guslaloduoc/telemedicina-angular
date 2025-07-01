import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @description
 * Guardia de ruta funcional que protege el acceso a las rutas de administración.
 * Verifica si el usuario actual tiene una sesión activa y si su rol es 'admin'.
 * Si no se cumplen las condiciones, redirige al usuario a la página de inicio.
 *
 * @param route La instantánea de la ruta activada.
 * @param state El estado futuro del enrutador.
 * @returns `true` si el usuario es un administrador y puede acceder a la ruta,
 * o `false` si el acceso es denegado.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  // Se inyectan los servicios necesarios usando la función inject().
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se obtiene el valor de la sesión actual desde el AuthService.
  const currentUser = authService.currentUserValue;

  // Se comprueba si existe una sesión y si el tipo de usuario es 'admin'.
  if (currentUser && currentUser.tipo === 'admin') {
    // Si el usuario está logueado y es admin, permite el acceso.
    return true;
  }

  // Si no se cumplen las condiciones, redirige a la página de inicio y deniega el acceso.
  router.navigate(['/home']);
  return false;
};

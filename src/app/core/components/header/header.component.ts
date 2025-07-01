import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserSession } from '../../services/auth.service';

/**
 * @description
 * Componente encargado de mostrar la barra de navegación principal de la aplicación.
 * Su contenido cambia dinámicamente dependiendo del estado de autenticación del usuario.
 */
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  /**
   * @description
   * Un Observable que emite la sesión del usuario actual (`UserSession`) o `null`.
   * La plantilla HTML se suscribe a este observable mediante el pipe `async` para
   * mostrar los menús correspondientes de forma reactiva.
   */
  currentUserSession$: Observable<UserSession | null>;

  /**
   * @description
   * Constructor del componente. Inyecta el AuthService para acceder al estado de la sesión.
   * @param authService El servicio de autenticación que provee el estado de la sesión.
   */
  constructor(private authService: AuthService) {
    this.currentUserSession$ = this.authService.currentUserSession$;
  }

  /**
   * @description
   * Llama al método de `logout` del servicio de autenticación para cerrar
   * la sesión del usuario actual.
   * @returns void
   */
  logout(): void {
    this.authService.logout();
  }
}

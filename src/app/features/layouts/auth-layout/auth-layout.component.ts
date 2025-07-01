import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * @description
 * Componente de layout que define la estructura para las páginas de autenticación,
 * como el login, registro y recuperación de contraseña.
 * Proporciona un entorno visual limpio y centrado, sin el header y footer principales,
 * y un <router-outlet> para el contenido de la página de autenticación.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {

}

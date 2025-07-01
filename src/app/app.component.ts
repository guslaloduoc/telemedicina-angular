import { Component } from '@angular/core';

/**
 * @description
 * Componente raíz y principal de la aplicación Angular.
 * Actúa como el contenedor principal para todos los demás componentes y vistas.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /**
   * @description
   * Título de la aplicación.
   */
  title = 'telemedicina';
}
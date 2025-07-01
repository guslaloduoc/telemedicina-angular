import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../../core/core.module';

/**
 * @description
 * Componente de layout que define la estructura principal para las páginas públicas
 * y las secciones de usuario de la aplicación.
 * Incluye el header y el footer comunes, y un <router-outlet> para el contenido de la página.
 */
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CoreModule,
    RouterModule  
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {

}
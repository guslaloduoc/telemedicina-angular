import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 1. Importar RouterModule

/**
 * @description
 * Componente que gestiona la página de inicio (landing page) de la aplicación.
 * Es la primera página que ven los visitantes.
 */
@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

}

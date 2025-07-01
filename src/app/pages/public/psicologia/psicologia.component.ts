import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

// La interfaz Doctor es reutilizable
interface Doctor {
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

@Component({
  selector: 'app-psicologia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './psicologia.component.html',
  styleUrls: ['./psicologia.component.scss']
})
export class PsicologiaComponent {
  // Cambiamos los datos para que correspondan a los psicólogos
  psicologos: Doctor[] = [
    {
      nombre: 'Lic. Sofía López',
      descripcion: 'Especialista en terapia cognitivo-conductual. Ayuda con ansiedad, estrés y desarrollo de habilidades de afrontamiento.',
      imagen: 'psicologia.jpeg',
      servicio: 'Terapia con Lic. Sofía López'
    },
    {
      nombre: 'Lic. Mateo Rojas',
      descripcion: 'Enfoque en terapia de pareja y resolución de conflictos. Espacio seguro para mejorar la comunicación y la conexión.',
      imagen: 'medicina-integrativa.jpg',
      servicio: 'Terapia con Lic. Mateo Rojas'
    },
    {
      nombre: 'Lic. Valentina Torres',
      descripcion: 'Psicología infantil y de la adolescencia. Apoyo en el manejo de emociones, conducta y desafíos del desarrollo.',
      imagen: 'medicina-general.jpg',
      servicio: 'Terapia con Lic. Valentina Torres'
    }
  ];

  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  /**
   * Llama al servicio del carrito para agendar una hora.
   * @param servicioNombre - El nombre del servicio a agendar.
   */
  agendarHora(servicioNombre: string): void {
    const resultado = this.cartService.addItem(servicioNombre);

    if (resultado.success) {
      this.mensaje = { tipo: 'exito', texto: resultado.message };
    } else {
      if (resultado.message.includes('iniciar sesión')) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.mensaje = { tipo: 'error', texto: resultado.message };
    }

    setTimeout(() => this.mensaje = null, 3000);
  }
}

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
  selector: 'app-medicina-integrativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicina-integrativa.component.html',
  styleUrls: ['./medicina-integrativa.component.scss']
})
export class MedicinaIntegrativaComponent {
  // Cambiamos los datos para que correspondan a los especialistas
  especialistas: Doctor[] = [
    {
      nombre: 'Dr. David Rojas',
      descripcion: 'Enfoque holístico que combina la medicina convencional con terapias de nutrición y bienestar general para un equilibrio completo.',
      imagen: 'medicina-general.jpg',
      servicio: 'Consulta con Dr. David Rojas'
    },
    {
      nombre: 'Dra. Isabela Muñoz',
      descripcion: 'Especialista en terapias alternativas como acupuntura y mindfulness para el manejo del dolor crónico y el estrés.',
       imagen: 'psicologia.jpeg',
      servicio: 'Consulta con Dra. Isabela Muñoz'
    },
    {
      nombre: 'Dr. Ricardo Soto',
      descripcion: 'Combinación de tratamientos convencionales con terapias naturales y suplementación para optimizar la salud y prevenir enfermedades.',
      imagen: 'medicina-integrativa.jpg',
      servicio: 'Consulta con Dr. Ricardo Soto'
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

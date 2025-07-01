import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

// Definimos una interfaz para la estructura de los datos de un doctor
interface Doctor {
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

@Component({
  selector: 'app-medicina-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicina-general.component.html',
  styleUrls: ['./medicina-general.component.scss']
})
export class MedicinaGeneralComponent {
  // En lugar de tener el HTML quemado, definimos los datos aquí
  doctores: Doctor[] = [
    {
      nombre: 'Dr. Juan Pérez',
      descripcion: 'Especialista en medicina familiar y atención primaria. Enfoque en prevención y manejo de enfermedades crónicas.',
      imagen: 'medicina-general.jpg',
      servicio: 'Consulta con Dr. Juan Pérez'
    },
    {
      nombre: 'Dra. Ana García',
      descripcion: 'Atención integral para adultos y niños. Experiencia en el manejo de condiciones agudas y chequeos preventivos.',
      imagen: 'psicologia.jpeg',
      servicio: 'Consulta con Dra. Ana García'
    },
    {
      nombre: 'Dr. Carlos Martínez',
      descripcion: 'Médico general con interés en dermatología y pequeñas dolencias. Orientado a soluciones rápidas y efectivas.',
      imagen: 'medicina-integrativa.jpg',
      servicio: 'Consulta con Dr. Carlos Martínez'
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
      // Si el error es por no estar logueado, redirigimos
      if (resultado.message.includes('iniciar sesión')) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.mensaje = { tipo: 'error', texto: resultado.message };
    }

    // Hacemos que el mensaje desaparezca después de 3 segundos
    setTimeout(() => this.mensaje = null, 3000);
  }
}

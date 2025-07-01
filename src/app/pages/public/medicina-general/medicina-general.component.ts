import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

/**
 * @description
 * Interfaz que define la estructura de los datos de un doctor o especialista.
 */
interface Doctor {
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

/**
 * @description
 * Componente que muestra la página de la especialidad de Medicina General.
 * Presenta una lista de doctores y permite a los usuarios agendar una hora con ellos.
 */
@Component({
  selector: 'app-medicina-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicina-general.component.html',
  styleUrls: ['./medicina-general.component.scss']
})
export class MedicinaGeneralComponent {
  /**
   * @description
   * Array que contiene los datos de los doctores de Medicina General a mostrar en la página.
   * Esta información se utiliza para renderizar las tarjetas de los especialistas dinámicamente.
   */
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

  /**
   * @description
   * Almacena un mensaje de feedback (éxito o error) para mostrar al usuario
   * después de intentar agendar una hora.
   */
  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;

  /**
   * @description
   * Constructor del componente. Inyecta los servicios necesarios.
   * @param cartService El servicio para gestionar el carrito de horas agendadas.
   * @param router El servicio de enrutamiento para redirigir al usuario si es necesario.
   */
  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  /**
   * @description
   * Método que se ejecuta al hacer clic en el botón "Agendar Hora".
   * Llama al `CartService` para añadir el servicio seleccionado al carrito del usuario.
   * @param servicioNombre El nombre del servicio específico que se va a agendar.
   * @returns void
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

/**
 * @description
 * Interfaz que define la estructura de los datos de un doctor o especialista.
 * @internal
 */
interface Doctor {
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

/**
 * @description
 * Componente que muestra la página de la especialidad de Medicina Integrativa.
 * Presenta una lista de especialistas y permite a los usuarios agendar una hora con ellos.
 */
@Component({
  selector: 'app-medicina-integrativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicina-integrativa.component.html',
  styleUrls: ['./medicina-integrativa.component.scss']
})
export class MedicinaIntegrativaComponent {
  /**
   * @description
   * Array que contiene los datos de los especialistas en Medicina Integrativa a mostrar.
   */
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
      if (resultado.message.includes('iniciar sesión')) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.mensaje = { tipo: 'error', texto: resultado.message };
    }

    setTimeout(() => this.mensaje = null, 3000);
  }
}

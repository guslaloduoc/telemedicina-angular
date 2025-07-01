import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

// FIX: Interfaz definida localmente para solucionar el problema de importación.
// La solución ideal es mover esta interfaz a su propio archivo (ej. /src/app/core/models/doctor.model.ts)
// y asegurarse de que la ruta de importación sea correcta.
interface Doctor {
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

/**
 * @description
 * Componente que muestra la página de la especialidad de Psicología.
 * Presenta una lista de psicólogos y permite a los usuarios agendar una hora con ellos.
 */
@Component({
  selector: 'app-psicologia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './psicologia.component.html',
  styleUrls: ['./psicologia.component.scss']
})
export class PsicologiaComponent {
  /**
   * @description
   * Array que contiene los datos de los psicólogos a mostrar en la página.
   */
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

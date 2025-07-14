import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EspecialidadesService } from '../../../core/services/especialidades.service';

/**
 * @description
 * Interfaz local que define la estructura de los datos de un doctor o especialista.
 * @internal
 */
interface Doctor {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  servicio: string;
}

/**
 * @description
 * Componente que muestra la página de la especialidad de Medicina Integrativa.
 * Presenta una lista de especialistas obtenida desde un servicio y permite agendar horas.
 */
@Component({
  selector: 'app-medicina-integrativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicina-integrativa.component.html',
  styleUrls: ['./medicina-integrativa.component.scss']
})
export class MedicinaIntegrativaComponent implements OnInit {
  /**
   * @description
   * Un Observable que emite la lista de especialistas para esta sección.
   */
  especialistas$!: Observable<Doctor[]>;

  /**
   * @description
   * Almacena un mensaje de feedback para mostrar al usuario.
   */
  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;

  /**
   * @description
   * Constructor del componente. Inyecta los servicios necesarios.
   * @param cartService El servicio para gestionar el carrito.
   * @param router El servicio de enrutamiento.
   * @param especialidadesService El servicio para obtener los datos de los doctores.
   */
  constructor(
    private cartService: CartService,
    private router: Router,
    private especialidadesService: EspecialidadesService
  ) {}

  /**
   * @description
   * Al inicializar el componente, se llama al servicio para obtener los especialistas.
   * @returns void
   */
  ngOnInit(): void {
    this.especialistas$ = this.especialidadesService.getDoctoresPorEspecialidad('medicina-integrativa');
  }

  /**
   * @description
   * Método que se ejecuta al hacer clic en el botón "Agendar Hora".
   * @param servicioNombre El nombre del servicio a agendar.
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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importar RouterModule para routerLink
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../../core/services/cart.service';

/**
 * @description
 * Componente que gestiona la página "Mis Horas", mostrando los servicios
 * que el usuario ha agendado en su carrito y permitiéndole gestionarlos.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añadir RouterModule a los imports
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  /**
   * @description
   * Un Observable que emite la lista de items del carrito para el usuario actual.
   * La plantilla se suscribe a este observable usando el pipe `async`.
   */
  items$: Observable<CartItem[]>;

  /**
   * @description
   * Almacena un mensaje de confirmación para mostrar al usuario después de
   * una acción exitosa, como confirmar las horas.
   */
  mensajeConfirmacion: string | null = null;

  /**
   * @description
   * Constructor del componente. Inyecta el CartService para interactuar con la lógica del carrito.
   * @param cartService El servicio que gestiona el estado del carrito.
   */
  constructor(private cartService: CartService) {
    this.items$ = this.cartService.getItemsForCurrentUser();
  }

  /**
   * @description
   * Método del ciclo de vida de Angular. Se deja vacío ya que la inicialización
   * principal se realiza en el constructor.
   * @returns void
   */
  ngOnInit(): void {}

  /**
   * @description
   * Llama al servicio del carrito para eliminar un item de la lista de horas.
   * @param item El objeto `CartItem` que se va a eliminar.
   * @returns void
   */
  eliminarItem(item: CartItem): void {
    this.cartService.removeItem(item);
  }

  /**
   * @description
   * Llama al servicio del carrito para confirmar todas las horas agendadas.
   * Muestra un mensaje de éxito temporal al usuario.
   * @returns void
   */
  confirmarHoras(): void {
    this.cartService.confirmarHoras();
    this.mensajeConfirmacion = '¡Horas confirmadas con éxito! 🎉';
    setTimeout(() => this.mensajeConfirmacion = null, 3000); // El mensaje desaparece después de 3s
  }
}
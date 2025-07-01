import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, UserSession } from './auth.service';

/**
 * @description
 * Interfaz que define la estructura de un item dentro del carrito.
 * Representa una hora de servicio agendada por un usuario.
 */
export interface CartItem {
  /**
   * @description
   * El nombre del servicio o consulta agendada.
   */
  servicio: string;
  /**
   * @description
   * El correo electrónico del usuario que agendó el servicio.
   * Se utiliza como identificador único.
   */
  usuario: string;  // Email del usuario
}

/**
 * @description
 * Servicio para gestionar el estado del carrito de compras de la aplicación.
 * Encapsula toda la lógica para agregar, eliminar y consultar items del carrito,
 * manteniendo el estado sincronizado con el localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  /**
   * @description
   * Subject que contiene el estado actual de todos los items del carrito de todos los usuarios.
   * Es privado para controlar cómo se emiten los nuevos valores.
   * @private
   */
  private cartSubject: BehaviorSubject<CartItem[]>;

  /**
   * @description
   * Observable público que los componentes pueden suscribir para recibir
   * actualizaciones en tiempo real del estado del carrito.
   */
  public cart$: Observable<CartItem[]>;

  /**
   * @description
   * Almacena la sesión del usuario actual para realizar operaciones filtradas.
   * @private
   */
  private currentUser: UserSession | null | undefined; 

  /**
   * @description
   * Inicializa el servicio, cargando el estado inicial del carrito desde localStorage
   * y suscribiéndose a los cambios de la sesión de autenticación.
   * @param authService El servicio de autenticación para obtener la sesión del usuario.
   */
  constructor(private authService: AuthService) {
    // Leemos el carrito inicial desde localStorage
    const initialCart = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.cartSubject = new BehaviorSubject<CartItem[]>(initialCart);
    this.cart$ = this.cartSubject.asObservable();

    // Nos suscribimos a los cambios de sesión para saber quién es el usuario actual
    this.authService.currentUserSession$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * @description
   * Filtra el observable del carrito para devolver solo los items
   * que pertenecen al usuario actualmente logueado.
   * @returns Un `Observable` que emite un array de `CartItem` para el usuario actual.
   */
  getItemsForCurrentUser(): Observable<CartItem[]> {
    return this.cart$.pipe(
      map(cart => cart.filter(item => item.usuario === this.currentUser?.correo))
    );
  }

  /**
   * @description
   * Agrega un nuevo servicio al carrito para el usuario actual.
   * Realiza validaciones para asegurar que el usuario esté logueado y que el item no exista previamente.
   * @param servicioNombre El nombre del servicio a agregar.
   * @returns Un objeto que indica si la operación fue exitosa (`success`) y un mensaje (`message`).
   */
  addItem(servicioNombre: string): { success: boolean; message: string } {
    if (!this.currentUser) {
      return { success: false, message: 'Debes iniciar sesión para agendar una hora.' };
    }

    const currentCart = this.cartSubject.value;
    const yaExiste = currentCart.some(item => 
      item.usuario === this.currentUser!.correo && item.servicio === servicioNombre
    );

    if (yaExiste) {
      return { success: false, message: 'Esta hora o servicio ya está en tu lista.' };
    }

    const newItem: CartItem = {
      servicio: servicioNombre,
      usuario: this.currentUser.correo
    };

    const updatedCart = [...currentCart, newItem];
    this.updateCart(updatedCart);
    
    return { success: true, message: `"${servicioNombre}" fue agregado a tus horas agendadas.` };
  }

  /**
   * @description
   * Elimina un item específico del carrito.
   * @param itemToRemove El objeto `CartItem` a eliminar.
   * @returns void
   */
  removeItem(itemToRemove: CartItem): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => 
      !(item.servicio === itemToRemove.servicio && item.usuario === itemToRemove.usuario)
    );
    this.updateCart(updatedCart);
  }

  /**
   * @description
   * Confirma las horas agendadas, eliminando todos los items del carrito
   * que pertenecen al usuario actual.
   * @returns void
   */
  confirmarHoras(): void {
    if (!this.currentUser) return;

    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.usuario !== this.currentUser!.correo);
    this.updateCart(updatedCart);
  }

  /**
   * @description
   * Método privado para centralizar la actualización del estado del carrito.
   * Guarda el nuevo estado en localStorage y emite el nuevo valor a través del `cartSubject`.
   * @param cart El nuevo array de `CartItem` a guardar.
   * @private
   * @returns void
   */
  private updateCart(cart: CartItem[]): void {
    localStorage.setItem('carrito', JSON.stringify(cart));
    this.cartSubject.next(cart); // Notifica a todos los suscriptores del cambio
  }
}

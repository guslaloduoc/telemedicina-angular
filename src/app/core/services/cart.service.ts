import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, UserSession } from './auth.service';

/**
 * @description
 * Interfaz que define la estructura de un item dentro del carrito.
 * Representa una hora de servicio agendada por un usuario.
 */
export interface CartItem {
  id?: number; // El ID será proporcionado por la API
  servicio: string;
  usuario: string;  // Email del usuario
}

/**
 * @description
 * Servicio para gestionar el estado del carrito de compras de la aplicación.
 * Carga los datos iniciales desde una API y simula las operaciones de escritura.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/carrito';

  /**
   * @description
   * Subject que contiene el estado actual de todos los items del carrito.
   * @private
   */
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  /**
   * @description
   * Observable público del estado del carrito.
   */
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  /**
   * @description
   * Almacena la sesión del usuario actual.
   * @private
   */
  private currentUser: UserSession | null = null;

  /**
   * @description
   * Inicializa el servicio, carga el carrito desde la API y se suscribe a la sesión.
   * @param authService El servicio de autenticación.
   * @param http El cliente HTTP para peticiones a la API.
   */
  constructor(private authService: AuthService, private http: HttpClient) {
    this.loadInitialCart();
    this.authService.currentUserSession$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * @description
   * Realiza una petición GET inicial para poblar el carrito en memoria.
   * @private
   */
  private loadInitialCart(): void {
    this.http.get<CartItem[]>(this.apiUrl).subscribe(cartItems => {
      this.cartSubject.next(cartItems);
      console.log('Carrito cargado desde la API simulada.');
    });
  }

  /**
   * @description
   * Filtra el carrito para devolver solo los items del usuario actual.
   * @returns Un `Observable` con los items del carrito del usuario.
   */
  getItemsForCurrentUser(): Observable<CartItem[]> {
    return this.cart$.pipe(
      map(cart => cart.filter(item => item.usuario === this.currentUser?.correo))
    );
  }

  /**
   * @description
   * SIMULACIÓN DE POST: Agrega un nuevo servicio al carrito en memoria.
   * @param servicioNombre El nombre del servicio a agregar.
   * @returns Un objeto con el resultado de la operación.
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
      // Simulamos la creación de un ID único
      id: new Date().getTime(),
      servicio: servicioNombre,
      usuario: this.currentUser.correo
    };

    const updatedCart = [...currentCart, newItem];
    this.cartSubject.next(updatedCart); // Solo notificamos el cambio en memoria
    
    return { success: true, message: `"${servicioNombre}" fue agregado a tus horas agendadas.` };
  }

  /**
   * @description
   * SIMULACIÓN DE DELETE: Elimina un item del carrito en memoria.
   * @param itemToRemove El objeto `CartItem` a eliminar.
   * @returns void
   */
  removeItem(itemToRemove: CartItem): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.id !== itemToRemove.id);
    this.cartSubject.next(updatedCart);
  }

  /**
   * @description
   * SIMULACIÓN DE DELETE MÚLTIPLE: Confirma las horas, eliminando los items del usuario.
   * @returns void
   */
  confirmarHoras(): void {
    if (!this.currentUser) return;

    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.usuario !== this.currentUser!.correo);
    this.cartSubject.next(updatedCart);
  }
}

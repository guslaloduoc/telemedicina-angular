import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../core/services/auth.service';

/**
 * @description
 * Servicio que gestiona los datos de los usuarios para el panel de administración.
 * Proporciona métodos para leer, actualizar y eliminar usuarios, manteniendo
 * el estado sincronizado con el localStorage de forma reactiva.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  /**
   * @description
   * Subject que contiene la lista actual de todos los usuarios.
   * Es privado para controlar cómo se emiten los nuevos valores.
   * @private
   */
  private usersSubject: BehaviorSubject<User[]>;

  /**
   * @description
   * Observable público que los componentes pueden suscribir para recibir
   * la lista de usuarios y reaccionar a sus cambios en tiempo real.
   */
  public users$: Observable<User[]>;

  /**
   * @description
   * Constructor del servicio. Se ejecuta una vez y carga el estado inicial
   * de los usuarios desde el localStorage.
   */
  constructor() {
    const initialUsers = this.getUsuariosFromStorage();
    this.usersSubject = new BehaviorSubject<User[]>(initialUsers);
    this.users$ = this.usersSubject.asObservable();
  }

  /**
   * @description
   * Actualiza los datos de un usuario específico en la lista.
   * @param updatedUser El objeto `User` con los datos actualizados.
   * @returns void
   */
  updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(u => u.email === updatedUser.email);
    if (userIndex > -1) {
      currentUsers[userIndex] = { ...currentUsers[userIndex], ...updatedUser };
      this.saveAndNotify(currentUsers);
    }
  }

  /**
   * @description
   * Elimina un usuario de la lista basado en su correo electrónico.
   * @param emailToDelete El correo del usuario que se va a eliminar.
   * @returns void
   */
  deleteUser(emailToDelete: string): void {
    let currentUsers = this.usersSubject.value;
    currentUsers = currentUsers.filter(u => u.email !== emailToDelete);
    this.saveAndNotify(currentUsers);
  }

  /**
   * @description
   * Método privado para obtener la lista completa de usuarios desde localStorage.
   * @private
   * @returns Un array de objetos `User`.
   */
  private getUsuariosFromStorage(): User[] {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  }

  /**
   * @description
   * Método privado para guardar la lista de usuarios en localStorage y notificar
   * a los suscriptores sobre el cambio a través del `usersSubject`.
   * @private
   * @param users El array de `User` a guardar.
   * @returns void
   */
  private saveAndNotify(users: User[]): void {
    localStorage.setItem("usuarios", JSON.stringify(users));
    this.usersSubject.next(users); // Notifica a los suscriptores
  }
}
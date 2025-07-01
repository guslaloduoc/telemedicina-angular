import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService, User } from './auth.service';

/**
 * @description
 * Servicio encargado de gestionar los datos del perfil del usuario.
 * Proporciona métodos para obtener y actualizar la información del perfil.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * @description
   * Constructor del servicio. Inyecta el AuthService para acceder a la sesión actual.
   * @param authService El servicio de autenticación para obtener la información del usuario logueado.
   */
  constructor(private authService: AuthService) { }

  /**
   * @description
   * Obtiene los datos completos del perfil del usuario actualmente logueado.
   * @returns Un `Observable` que emite el objeto `User` del perfil o `null` si no hay sesión.
   */
  getCurrentUserProfile(): Observable<User | null> {
    const currentUserSession = this.authService.currentUserValue;
    if (!currentUserSession) {
      return of(null); // No hay usuario logueado
    }

    const usuarios = this.getUsuariosFromStorage();
    const perfilUsuario = usuarios.find(u => u.email === currentUserSession.correo);
    
    return of(perfilUsuario || null);
  }

  /**
   * @description
   * Actualiza los datos del perfil de un usuario en la base de datos (localStorage).
   * @param updatedProfile El objeto `User` con los nuevos datos del perfil a guardar.
   * @returns `true` si la actualización fue exitosa, `false` si el usuario no fue encontrado.
   */
  updateUserProfile(updatedProfile: User): boolean {
    const usuarios = this.getUsuariosFromStorage();
    const userIndex = usuarios.findIndex(u => u.email === updatedProfile.email);

    if (userIndex === -1) {
      return false; // No se encontró al usuario
    }

    // Actualizamos manteniendo los campos que no se pueden cambiar (password, tipo)
    usuarios[userIndex] = {
      ...usuarios[userIndex], // Mantiene password y tipo originales
      nombre: updatedProfile.nombre,
      usuario: updatedProfile.usuario,
      fechaNacimiento: updatedProfile.fechaNacimiento
    };
    
    this.saveUsuariosToStorage(usuarios);
    return true;
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
   * Método privado para guardar la lista de usuarios actualizada en localStorage.
   * @private
   * @param usuarios El array de `User` a guardar.
   * @returns void
   */
  private saveUsuariosToStorage(usuarios: User[]) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}
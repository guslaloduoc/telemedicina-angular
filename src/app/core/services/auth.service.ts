import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @description
 * Define la estructura de la sesión de un usuario.
 */
export interface UserSession {
  logueado: boolean;
  correo: string; // Cambiado de 'usuario' a 'correo' para consistencia
  tipo: 'admin' | 'usuario'; 
}

/**
 * @description
 * Define la estructura de los datos de un usuario.
 */
export interface User {
  nombre: string;
  usuario?: string; // Opcional, ya que no se usa en la sesión
  email: string;
  password?: string; // El password no debería guardarse en la sesión
  tipo: 'admin' | 'usuario';
  fechaNacimiento?: string;
}

// Constante para el admin por defecto
const DEFAULT_ADMIN: User = {
  nombre: "Administrador",
  usuario: "admin",
  email: "dayanaolivares377@gmail.com",
  password: "Admin123",
  tipo: "admin"
};

/**
 * @description
 * Servicio que gestiona todo lo relacionado con la autenticación de usuarios en la aplicación.
 * Encapsula toda la lógica para iniciar sesión, cerrar sesión, registrar y gestionar usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * @description
   * Subject que contiene el estado actual de la sesión del usuario.
   * Es privado para controlar cómo se emiten los nuevos valores.
   * @private
   */
  private currentUserSessionSubject: BehaviorSubject<UserSession | null>;

  /**
   * @description
   * Observable público al que los componentes pueden suscribirse para recibir
   * actualizaciones en tiempo real del estado de la sesión.
   */
  public currentUserSession$: Observable<UserSession | null>;

  /**
   * @description
   * Inicializa el servicio, cargando la sesión inicial desde localStorage
   * y suscribiéndose a los cambios en la sesión de autenticación.
   * @param router El servicio Router para manejar la navegación.
   */
  constructor(private router: Router) {
    const sesionGuardada = localStorage.getItem('sesion');
    this.currentUserSessionSubject = new BehaviorSubject<UserSession | null>(
      sesionGuardada ? JSON.parse(sesionGuardada) : null
    );
    this.currentUserSession$ = this.currentUserSessionSubject.asObservable();
  }

  /**
   * @description
   * Expone el valor actual de la sesión del usuario.
   * @returns La sesión del usuario actual o null si no hay sesión.
   */
  public get currentUserValue(): UserSession | null {
    return this.currentUserSessionSubject.value;
  }

  /**
   * @description
   * Lógica de inicialización para asegurar que el usuario administrador exista.
   * Será llamado por APP_INITIALIZER.
   * @returns void
   */
  asegurarAdminPorDefecto() {
    const usuarios = this.getUsuarios();
    const existeAdmin = usuarios.some(user => user.email === DEFAULT_ADMIN.email);

    if (!existeAdmin) {
      usuarios.push(DEFAULT_ADMIN);
      this.guardarUsuarios(usuarios);
      console.log("🛠 Usuario admin creado por defecto por Angular.");
    }
  }

  /**
   * @description
   * Intenta autenticar a un usuario y devuelve true/false.
   * @param email El email del usuario.
   * @param password La contraseña del usuario.
   * @returns `true` si el login es exitoso, `false` en caso contrario.
   */
  login(email: string, password: string): boolean {
    const usuarios = this.getUsuarios();
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioEncontrado) {
      const sesion: UserSession = {
        logueado: true,
        correo: usuarioEncontrado.email,
        tipo: usuarioEncontrado.tipo
      };
      localStorage.setItem('sesion', JSON.stringify(sesion));
      this.currentUserSessionSubject.next(sesion);
      
      this.router.navigate([usuarioEncontrado.tipo === 'admin' ? '/admin' : '/user/perfil']);
      return true;
    }
    
    return false; // Login fallido
  }

  /**
   * @description
   * Cierra la sesión del usuario.
   * @returns void
   */
  logout() {
    localStorage.removeItem('sesion');
    this.currentUserSessionSubject.next(null);
    this.router.navigate(['/home']);
  }

  /**
   * @description
   * Método privado para interactuar con LocalStorage y obtener la lista de usuarios.
   * @private
   * @returns La lista de usuarios.
   */
  private getUsuarios(): User[] {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  }

  /**
   * @description
   * Método privado para guardar la lista de usuarios en LocalStorage.
   * @private
   * @param usuarios La lista de usuarios a guardar.
   * @returns void
   */
  private guardarUsuarios(usuarios: User[]) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  /**
   * @description
   * Registra un nuevo usuario.
   * @param newUser El objeto del nuevo usuario a registrar.
   * @returns `true` si el registro es exitoso, `false` si el email ya existe.
   */
  register(newUser: User): boolean {
    const usuarios = this.getUsuarios();
    const existe = this.checkEmailExists(newUser.email);

    if (existe) {
      return false; // El email ya está en uso
    }

    // Aseguramos que el tipo de usuario sea 'usuario'
    newUser.tipo = 'usuario'; 
    usuarios.push(newUser);
    this.guardarUsuarios(usuarios);
    
    return true; // Registro exitoso
  }

  /**
   * @description
   * Verifica si un correo electrónico ya existe en la base de datos (localStorage).
   * @param email El correo a verificar.
   * @returns `true` si el email existe, `false` en caso contrario.
   */
  checkEmailExists(email: string): boolean {
    const usuarios = this.getUsuarios();
    return usuarios.some(u => u.email === email);
  }

  /**
   * @description
   * Actualiza la contraseña de un usuario si el email existe.
   * @param email El correo del usuario.
   * @param newPassword La nueva contraseña.
   * @returns `true` si la contraseña se actualizó, `false` si el usuario no existe.
   */
  recoverPassword(email: string, newPassword: string): boolean {
    const usuarios = this.getUsuarios();
    const userIndex = usuarios.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return false; // Usuario no encontrado
    }

    // Actualizamos la contraseña
    usuarios[userIndex].password = newPassword;
    this.guardarUsuarios(usuarios);
    
    return true; // Actualización exitosa
  }
}
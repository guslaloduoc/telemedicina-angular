import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { AdminService } from '../../features/admin/services/admin.service';

/**
 * @description
 * Define la estructura de la sesión de un usuario.
 */
export interface UserSession {
  logueado: boolean;
  correo: string;
  tipo: 'admin' | 'usuario'; 
}

/**
 * @description
 * Define la estructura de los datos de un usuario.
 */
export interface User {
  id?: number;
  nombre: string;
  usuario?: string;
  email: string;
  password?: string;
  tipo: 'admin' | 'usuario';
  fechaNacimiento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSessionSubject: BehaviorSubject<UserSession | null>;
  public currentUserSession$: Observable<UserSession | null>;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) {
    const sesionGuardada = localStorage.getItem('sesion');
    this.currentUserSessionSubject = new BehaviorSubject<UserSession | null>(
      sesionGuardada ? JSON.parse(sesionGuardada) : null
    );
    this.currentUserSession$ = this.currentUserSessionSubject.asObservable();
  }

  public get currentUserValue(): UserSession | null {
    return this.currentUserSessionSubject.value;
  }

  login(email: string, password: string): Observable<UserSession | null> {
    return this.adminService.users$.pipe(
      filter(users => users.length > 0),
      take(1),
      map(users => {
        const usuarioEncontrado = users.find(u => u.email === email && u.password === password);
        if (usuarioEncontrado) {
          const sesion: UserSession = { 
            logueado: true,
            correo: usuarioEncontrado.email,
            tipo: usuarioEncontrado.tipo
          };
          localStorage.setItem('sesion', JSON.stringify(sesion));
          this.currentUserSessionSubject.next(sesion);
          this.router.navigate([usuarioEncontrado.tipo === 'admin' ? '/admin' : '/user/perfil']);
          return sesion;
        }
        return null;
      })
    );
  }
  
  register(newUser: User): Observable<boolean> {
    return this.adminService.users$.pipe(
      take(1),
      map(users => {
        const existe = users.some(u => u.email === newUser.email);
        if (existe) return false;
        
        newUser.tipo = 'usuario';
        this.adminService.addUser(newUser);
        return true;
      })
    );
  }

  logout() {
    localStorage.removeItem('sesion');
    this.currentUserSessionSubject.next(null);
    this.router.navigate(['/home']);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.adminService.users$.pipe(
      take(1),
      map(users => users.some(u => u.email === email))
    );
  }

  recoverPassword(email: string, newPassword: string): boolean {
    const users = this.adminService.currentUsersValue;
    const userToUpdate = users.find(u => u.email === email);

    if (!userToUpdate) {
      return false;
    }

    const updatedUser = { ...userToUpdate, password: newPassword };
    this.adminService.updateUser(updatedUser);
    
    return true;
  }
}
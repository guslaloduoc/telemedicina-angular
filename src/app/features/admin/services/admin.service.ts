import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../core/services/auth.service'; // FIX: Importar desde AuthService
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<User[]>(this.apiUrl).subscribe(users => {
      this.usersSubject.next(users);
    });
  }
  
  public get currentUsersValue(): User[] {
    return this.usersSubject.value;
  }

  /**
   * @description
   * SIMULACIÓN DE POST: Agrega un nuevo usuario al array en memoria.
   * @param newUser El objeto del nuevo usuario a agregar.
   */

  addUser(newUser: User): void {
    const currentUsers = this.currentUsersValue;
    const newId = Math.max(0, ...currentUsers.map(u => u.id || 0)) + 1;
    newUser.id = newId;
    this.usersSubject.next([...currentUsers, newUser]);
  }

   /**
   * @description
   * SIMULACIÓN DE PUT: Actualiza un usuario en el array en memoria.
   * @param updatedUser El objeto `User` con los datos actualizados.
   */

  updateUser(updatedUser: User): void {
    const users = this.currentUsersValue;
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      this.usersSubject.next([...users]);
    }
  }

    /**
   * @description
   * SIMULACIÓN DE DELETE: Elimina un usuario del array en memoria.
   * @param userId El ID del usuario que se va a eliminar.
   */
  deleteUser(userId: number): void {
    const users = this.currentUsersValue;
    const updatedUsers = users.filter(u => u.id !== userId);
    this.usersSubject.next(updatedUsers);
  }
}
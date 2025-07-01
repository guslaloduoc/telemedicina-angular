import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private usersSubject: BehaviorSubject<User[]>;
  public users$: Observable<User[]>;

  constructor() {
    const initialUsers = this.getUsuariosFromStorage();
    this.usersSubject = new BehaviorSubject<User[]>(initialUsers);
    this.users$ = this.usersSubject.asObservable();
  }

  // --- Métodos CRUD ---

  updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(u => u.email === updatedUser.email);
    if (userIndex > -1) {
      currentUsers[userIndex] = { ...currentUsers[userIndex], ...updatedUser };
      this.saveAndNotify(currentUsers);
    }
  }

  deleteUser(emailToDelete: string): void {
    let currentUsers = this.usersSubject.value;
    currentUsers = currentUsers.filter(u => u.email !== emailToDelete);
    this.saveAndNotify(currentUsers);
  }

  // --- Métodos Helper ---

  private getUsuariosFromStorage(): User[] {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  }

  private saveAndNotify(users: User[]): void {
    localStorage.setItem("usuarios", JSON.stringify(users));
    this.usersSubject.next(users); // Notifica a los suscriptores
  }
}
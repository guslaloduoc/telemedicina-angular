import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthService, User } from './auth.service'; // FIX: Ruta de importación actualizada
import { AdminService } from '../../features/admin/services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  getCurrentUserProfile(): Observable<User | null> {
    return combineLatest([
      this.authService.currentUserSession$,
      this.adminService.users$.pipe(
        filter(users => users.length > 0)
      )
    ]).pipe(
      map(([session, users]) => {
        if (!session) {
          return null;
        }
        return users.find(u => u.email === session.correo) || null;
      })
    );
  }

  updateUserProfile(updatedProfile: User): void {
    this.adminService.updateUser(updatedProfile);
  }
}
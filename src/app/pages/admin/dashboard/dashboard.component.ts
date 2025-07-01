import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdminService } from '../../../features/admin/services/admin.service';
import { AuthService, User } from '../../../core/services/auth.service';

declare var bootstrap: any; // Declaramos bootstrap para poder usarlo

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  editForm!: FormGroup;
  currentUserEmail: string | null = null;
  
  private userToEdit: User | null = null;
  private modalInstance: any;
  private authSubscription: Subscription;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.users$ = this.adminService.users$;
    this.authSubscription = this.authService.currentUserSession$.subscribe(session => {
      this.currentUserEmail = session?.correo ?? null;
    });
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      tipo: ['usuario', Validators.required]
    });

    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  openEditModal(user: User): void {
    this.userToEdit = user;
    this.editForm.setValue({
      nombre: user.nombre,
      usuario: user.usuario || '',
      email: user.email,
      tipo: user.tipo
    });
    this.modalInstance.show();
  }

  saveChanges(): void {
    if (this.editForm.invalid || !this.userToEdit) {
      return;
    }
    const updatedData = { ...this.userToEdit, ...this.editForm.getRawValue() };
    this.adminService.updateUser(updatedData);
    this.modalInstance.hide();
  }

  deleteUser(user: User): void {
    if (user.email === this.currentUserEmail) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    if (confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) {
      this.adminService.deleteUser(user.email);
    }
  }
}

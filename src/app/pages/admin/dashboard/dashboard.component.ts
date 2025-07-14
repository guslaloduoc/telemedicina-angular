import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdminService } from '../../../features/admin/services/admin.service';
import { AuthService, User } from '../../../core/services/auth.service';

declare var bootstrap: any; // Declaramos bootstrap para poder usarlo

/**
 * @description
 * Componente que gestiona el panel de administración (dashboard).
 * Muestra una tabla con todos los usuarios registrados y permite realizar
 * operaciones de edición y eliminación sobre ellos.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  /**
   * @description
   * Un Observable que emite la lista de todos los usuarios.
   * La plantilla se suscribe a este observable para mostrar los datos en la tabla.
   */
  users$: Observable<User[]>;

  /**
   * @description
   * El FormGroup para el formulario de edición de usuario en el modal.
   */
  editForm!: FormGroup;

  /**
   * @description
   * Almacena el correo del administrador actual para deshabilitar el botón de auto-eliminación.
   */
  currentUserEmail: string | null = null;
  
  /**
   * @description
   * Almacena temporalmente el objeto de usuario que se está editando en el modal.
   * @private
   */
  private userToEdit: User | null = null;

  /**
   * @description
   * Instancia del modal de edición de Bootstrap para poder controlarlo programáticamente.
   * @private
   */
  private modalInstance: any;

  /**
   * @description
   * Almacena la suscripción al estado de autenticación para poder desuscribirse
   * cuando el componente se destruye y evitar fugas de memoria.
   * @private
   */
  private authSubscription: Subscription;

  /**
   * @description
   * Constructor del componente. Inyecta los servicios necesarios.
   * @param adminService Servicio para gestionar las operaciones de los usuarios (CRUD).
   * @param authService Servicio para obtener la sesión del usuario actual.
   * @param fb Servicio FormBuilder para crear el formulario reactivo de edición.
   */
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

  /**
   * @description
   * Método del ciclo de vida de Angular. Se ejecuta al inicializar el componente.
   * Crea el formulario de edición y la instancia del modal de Bootstrap.
   * @returns void
   */
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

  /**
   * @description
   * Método del ciclo de vida de Angular. Se ejecuta cuando el componente es destruido.
   * Se encarga de limpiar la suscripción al `AuthService` para prevenir fugas de memoria.
   * @returns void
   */
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /**
   * @description
   * Abre el modal de edición y carga los datos del usuario seleccionado en el formulario.
   * @param user El objeto `User` que se va a editar.
   * @returns void
   */
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

  /**
   * @description
   * Se ejecuta al guardar los cambios en el modal de edición.
   * Valida el formulario y llama al servicio para actualizar los datos del usuario.
   * @returns void
   */
  saveChanges(): void {
    if (this.editForm.invalid || !this.userToEdit) {
      return;
    }
    const updatedData = { ...this.userToEdit, ...this.editForm.getRawValue() };
    this.adminService.updateUser(updatedData);
    this.modalInstance.hide();
  }

  /**
   * @description
   * Elimina un usuario de la lista, previa confirmación.
   * Incluye una validación para prevenir que el administrador se elimine a sí mismo.
   * @param user El objeto `User` que se va a eliminar.
   * @returns void
   */
  deleteUser(user: User): void {
    if (user.email === this.currentUserEmail) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }
    if (confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) {
      // FIX: Usamos el ID del usuario, que ahora viene de la API
      this.adminService.deleteUser(user.id!); 
    }
  }
}

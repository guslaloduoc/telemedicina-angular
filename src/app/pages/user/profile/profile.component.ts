import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../core/services/auth.service'; // FIX: Ruta de importación actualizada
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  /**
   * Observable que emite el perfil del usuario autenticado.
   * Emite `null` si no hay usuario.
   */
  user$: Observable<User | null>;

  /**
   * FormGroup que representa el formulario de edición de perfil.
   * Contiene controles para nombre, usuario, email y fecha de nacimiento.
   */
  profileForm!: FormGroup;

  /**
   * Mensaje de éxito que se muestra tras actualizar el perfil.
   * Se resetea a null después de 3 segundos.
   */
  mensajeExito: string | null = null;

  /**
   * Constructor del componente de perfil.
   *
   * @param userService Servicio para obtener y actualizar datos del usuario.
   * @param fb Instancia de FormBuilder para crear el formulario reactivo.
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Inicializa el observable del perfil del usuario
    this.user$ = this.userService.getCurrentUserProfile();
  }

  /**
   * Ciclo de vida OnInit.
   * - Crea y configura el formulario reactive con validaciones.
   * - Se suscribe a `user$` para rellenar el formulario con los datos actuales.
   */
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      fechaNacimiento: ['', Validators.required]
    });

    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
      }
    });
  }

  /**
   * Método que se ejecuta al enviar el formulario.
   * - Valida el formulario.
   * - Envía los datos actualizados al servicio.
   * - Muestra un mensaje de éxito temporal.
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    const updatedData = this.profileForm.getRawValue();
    this.userService.updateUserProfile(updatedData);

    this.mensajeExito = '¡Perfil actualizado con éxito!';
    setTimeout(() => (this.mensajeExito = null), 3000);
  }
}

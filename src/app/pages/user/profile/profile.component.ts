import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { User } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

/**
 * @description
 * Componente que gestiona la página de "Mi Perfil".
 * Muestra los datos del usuario logueado y le permite actualizar su información.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  /**
   * @description
   * Un Observable que emite los datos del perfil del usuario actual.
   * La plantilla se suscribe a este observable para mostrar la información dinámicamente.
   */
  user$: Observable<User | null>;

  /**
   * @description
   * El FormGroup que define la estructura y validaciones del formulario de edición del perfil.
   */
  profileForm!: FormGroup;

  /**
   * @description
   * Almacena un mensaje de éxito para mostrar al usuario después de actualizar el perfil.
   */
  mensajeExito: string | null = null;

  /**
   * @description
   * Constructor del componente. Inyecta los servicios necesarios para su funcionamiento.
   * @param userService El servicio para obtener y actualizar los datos del perfil.
   * @param fb El servicio FormBuilder para crear el formulario reactivo.
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.user$ = this.userService.getCurrentUserProfile();
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se encarga de crear el formulario y de cargar los datos del usuario en él.
   * @returns void
   */
  ngOnInit(): void {
    // Inicializamos el formulario
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: [{ value: '', disabled: true }], // Campo deshabilitado
      fechaNacimiento: ['', Validators.required]
    });

    // Cargamos los datos del usuario en el formulario
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
      }
    });
  }

  /**
   * @description
   * Método que se ejecuta cuando el usuario envía el formulario de edición.
   * Valida el formulario y, si es válido, llama al servicio para guardar los cambios.
   * @returns void
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    // Usamos getRawValue() para obtener también los valores de campos deshabilitados (como el email)
    const exito = this.userService.updateUserProfile(this.profileForm.getRawValue());
    
    if (exito) {
      this.mensajeExito = '¡Perfil actualizado con éxito!';
      setTimeout(() => (this.mensajeExito = null), 3000);
    }
  }
}
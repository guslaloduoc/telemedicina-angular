import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * @description
 * Validador a nivel de formulario que comprueba si dos campos de contraseña coinciden.
 * @param control El `FormGroup` que contiene los controles de contraseña.
 * @returns Un objeto de error `passwordMismatch` si no coinciden, o `null` si coinciden.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('nuevaPassword');
  const confirmarPassword = control.get('confirmarPassword');
  return password && confirmarPassword && password.value !== confirmarPassword.value 
    ? { passwordMismatch: true } 
    : null;
};

/**
 * @description
 * Componente que gestiona la página y el formulario para la recuperación de contraseña.
 */
@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  /**
   * @description
   * El FormGroup que define la estructura y validaciones del formulario de recuperación.
   */
  recoverForm!: FormGroup;

  /**
   * @description
   * Almacena un mensaje de feedback (éxito o error) para mostrar al usuario.
   */
  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;

  /**
   * @description
   * Constructor del componente. Inyecta las dependencias necesarias.
   * @param fb El servicio FormBuilder para crear el formulario reactivo.
   * @param authService El servicio de autenticación para manejar la lógica de recuperación.
   * @param router El servicio de enrutamiento para redirigir al usuario.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * @description
   * Método del ciclo de vida de Angular. Se ejecuta al inicializar el componente
   * y se encarga de crear el formulario con todas sus validaciones.
   * @returns void
   */
  ngOnInit(): void {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  /**
   * @description
   * Método que se ejecuta al enviar el formulario de recuperación.
   * Valida los datos y, si son correctos, llama al servicio para actualizar la contraseña.
   * @returns void
   */
  onSubmit(): void {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    const { email, nuevaPassword } = this.recoverForm.value;
    const exito = this.authService.recoverPassword(email, nuevaPassword);

    if (exito) {
      this.mensaje = { tipo: 'exito', texto: 'Contraseña actualizada exitosamente ✅' };
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2500);
    } else {
      this.mensaje = { tipo: 'error', texto: 'No se encontró un usuario con ese correo.' };
    }
  }
}

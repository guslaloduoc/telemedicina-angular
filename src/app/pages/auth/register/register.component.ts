import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CustomValidators } from '../../../core/validators/custom-validators';
import { AuthService, User } from '../../../core/services/auth.service';

/**
 * @description
 * Validador asíncrono que verifica si un correo electrónico ya está en uso.
 * @param authService El servicio de autenticación para consultar la existencia del email.
 * @returns Una función `AsyncValidatorFn` que Angular puede utilizar.
 */
export function emailExistsValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    // Usamos un timer para esperar 500ms antes de hacer la consulta
    return timer(500).pipe(
      switchMap(() => 
        // Se suscribe al Observable devuelto por el servicio
        authService.checkEmailExists(control.value).pipe(
          map(exists => (exists ? { emailExists: true } : null)),
          take(1) // Se asegura de que el observable se complete
        )
      )
    );
  };
}

/**
 * @public
 * @description
 * Validador a nivel de formulario que comprueba si dos campos de contraseña coinciden.
 * @param control El `FormGroup` que contiene los controles de contraseña.
 * @returns Un objeto de error `passwordMismatch` si no coinciden, o `null` si coinciden.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmarPassword = control.get('confirmarPassword');

  return password && confirmarPassword && password.value !== confirmarPassword.value 
    ? { passwordMismatch: true } 
    : null;
};

/**
 * @description
 * Componente que gestiona la página y el formulario de registro de nuevos usuarios.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  /**
   * @description
   * El FormGroup que define la estructura y validaciones del formulario de registro.
   */
  registerForm!: FormGroup;

  /**
   * @description
   * Bandera para controlar la visibilidad del mensaje de registro exitoso.
   */
  registroExitoso: boolean = false;

  /**
   * @description
   * Constructor del componente. Inyecta las dependencias necesarias.
   * @param fb El servicio FormBuilder para crear el formulario reactivo.
   * @param authService El servicio de autenticación para manejar la lógica de registro.
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
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', 
        [Validators.required, Validators.email],
        [emailExistsValidator(this.authService)]
      ],
      fechaNacimiento: ['', [Validators.required, CustomValidators.edadMinima(18)]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[A-Z]).{8,}/)]],
      confirmarPassword: ['', Validators.required],
      comentarios: [''] // Campo opcional
    }, { 
      validators: CustomValidators.passwordMatch('password', 'confirmarPassword')
    });
  }

  /**
   * @description
   * Método que se ejecuta al enviar el formulario de registro.
   * Valida los datos y se suscribe al método de registro del servicio de autenticación.
   * @returns void
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmarPassword, ...userData } = this.registerForm.value;
    
    // REFACTOR: Ahora nos suscribimos al Observable que devuelve el método register.
    this.authService.register(userData).subscribe(exito => {
      if (exito) {
        this.registroExitoso = true;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        // Si el registro falla (porque el email ya existe), mostramos un error en el campo email.
        this.registerForm.get('email')?.setErrors({ emailExists: true });
      }
    });
  }
}

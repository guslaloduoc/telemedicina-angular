import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, first } from 'rxjs/operators';
import { CustomValidators } from '../../../core/validators/custom-validators'; // Importamos nuestros validadores
import { AuthService } from '../../../core/services/auth.service';

// --- Validador Asíncrono para Email ---
export function emailExistsValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      debounceTime(500),
      switchMap(email => 
        authService.checkEmailExists(email) 
          ? of({ emailExists: true })
          : of(null)
      ),
      first()
    );
  };
}

// --- Validador Síncrono para Contraseñas ---
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmarPassword = control.get('confirmarPassword');

  return password && confirmarPassword && password.value !== confirmarPassword.value 
    ? { passwordMismatch: true } 
    : null;
};


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
  registerForm!: FormGroup;
  registroExitoso: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Excluimos confirmarPassword del objeto a guardar
    const { confirmarPassword, ...userData } = this.registerForm.value;
    const exito = this.authService.register(userData);

    if (exito) {
      this.registroExitoso = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    } 
  }
}
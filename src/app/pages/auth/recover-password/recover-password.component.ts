import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Reutilizamos el validador de coincidencia de contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('nuevaPassword');
  const confirmarPassword = control.get('confirmarPassword');
  return password && confirmarPassword && password.value !== confirmarPassword.value 
    ? { passwordMismatch: true } 
    : null;
};

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  recoverForm!: FormGroup;
  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

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
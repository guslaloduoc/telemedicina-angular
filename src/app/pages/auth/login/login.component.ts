import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * @description
 * Componente encargado de gestionar la página y el formulario de inicio de sesión.
 * Permite a los usuarios ingresar sus credenciales para autenticarse en la aplicación.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * @description
   * El FormGroup que define la estructura y validaciones del formulario de login.
   */
  loginForm!: FormGroup;

  /**
   * @description
   * Bandera para controlar la visibilidad del mensaje de error de credenciales incorrectas.
   */
  loginInvalido: boolean = false;

  /**
   * @description
   * Constructor del componente. Inyecta las dependencias necesarias.
   * @param fb El servicio FormBuilder para crear formularios reactivos.
   * @param authService El servicio de autenticación para manejar la lógica de login.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se utiliza para crear y configurar el formulario de login.
   * @returns void
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * @description
   * Getter de acceso rápido a los controles del formulario para facilitar
   * la validación en la plantilla HTML.
   * @returns Los controles del `loginForm`.
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * @description
   * Método que se ejecuta cuando el usuario envía el formulario.
   * Valida los datos y llama al método síncrono de login del servicio de autenticación.
   * @returns void
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // REFACTOR: Volvemos a la llamada síncrona, ya que el servicio ahora devuelve un booleano.
    const exito = this.authService.login(this.f['email'].value, this.f['password'].value);

    if (!exito) {
      // Si el método devuelve false, significa que el login falló.
      this.loginInvalido = true;
    }
    // Si el login es exitoso, el AuthService ya se encarga de la redirección.
  }
}

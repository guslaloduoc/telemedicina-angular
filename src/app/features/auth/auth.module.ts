import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

// CONEXIÓN: Importamos los componentes de PÁGINA que este módulo va a gestionar.
import { LoginComponent } from '../../pages/auth/login/login.component';
import { RegisterComponent } from '../../pages/auth/register/register.component';
import { RecoverPasswordComponent } from '../../pages/auth/recover-password/recover-password.component';
import { ReactiveFormsModule } from '@angular/forms'; // 1. Importar para los formularios


@NgModule({
  declarations: [
    // CONEXIÓN: Declaramos los componentes para que pertenezcan a este módulo.

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    LoginComponent,
    LoginComponent,
    RegisterComponent,
    RecoverPasswordComponent,
    ReactiveFormsModule ,
    
  ]
})
export class AuthModule { }
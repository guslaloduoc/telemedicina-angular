import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// CONEXIÓN: Importamos los componentes de PÁGINA que vamos a enrutar.
import { LoginComponent } from '../../pages/auth/login/login.component';
import { RegisterComponent } from '../../pages/auth/register/register.component';
import { RecoverPasswordComponent } from '../../pages/auth/recover-password/recover-password.component';

const routes: Routes = [
  // CONEXIÓN: Definimos las rutas relativas a la ruta padre ('/auth')
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recuperar', component: RecoverPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
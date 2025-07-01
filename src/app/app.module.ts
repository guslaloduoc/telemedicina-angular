import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

// CONEXIÓN: Importamos las páginas públicas que este módulo controlará
import { HomeComponent } from './pages/public/home/home.component';
import { PsicologiaComponent } from './pages/public/psicologia/psicologia.component';
import { MedicinaGeneralComponent } from './pages/public/medicina-general/medicina-general.component';
import { MedicinaIntegrativaComponent } from './pages/public/medicina-integrativa/medicina-integrativa.component';

import { AuthService } from './core/services/auth.service';
import { AuthLayoutComponent } from './features/layouts/auth-layout/auth-layout.component';


// --- NUEVO: Función Factory para el APP_INITIALIZER ---
// Esta función se ejecutará al inicio. Devuelve una función que devuelve una Promesa.
export function appInitializer(authService: AuthService) {
  return () => new Promise(resolve => {
    authService.asegurarAdminPorDefecto();
    resolve(true);
  });
}


@NgModule({
   providers: [
    { 
      provide: APP_INITIALIZER, 
      useFactory: appInitializer, 
      deps: [AuthService],
      multi: true 
    }
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    MedicinaGeneralComponent,
    PsicologiaComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
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


/**
 * @description
 * Función de tipo factory que se ejecuta durante la inicialización de la aplicación.
 * Se utiliza para asegurar que ciertas tareas, como la creación de un usuario administrador
 * por defecto, se completen antes de que la aplicación sea completamente funcional.
 * @param authService El servicio de autenticación necesario para realizar la tarea de inicialización.
 * @returns Una función que devuelve una `Promise`.
 */
export function appInitializer(authService: AuthService) {
  return () => new Promise(resolve => {
    authService.asegurarAdminPorDefecto();
    resolve(true);
  });
}

/**
 * @description
 * Módulo raíz de la aplicación Angular.
 * Es el punto de entrada principal que organiza y ensambla todas las partes de la aplicación.
 */
@NgModule({
  /**
   * @description
   * Proveedores de servicios para la inyección de dependencias.
   * Aquí se registra el `APP_INITIALIZER` para ejecutar código al arranque.
   */
  providers: [
    { 
      provide: APP_INITIALIZER, 
      useFactory: appInitializer, 
      deps: [AuthService],
      multi: true 
    }
  ],
  /**
   * @description
   * El conjunto de componentes, directivas y pipes que pertenecen a este módulo.
   */
  declarations: [
    AppComponent,
    HomeComponent
  ],
  /**
   * @description
   * La lista de otros módulos cuyas clases exportadas son necesarias para las plantillas
   * de los componentes declarados en este módulo.
   */
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    MedicinaGeneralComponent,
    PsicologiaComponent
  ],
  /**
   * @description
   * El componente principal que Angular crea e inserta en el `index.html`
   * como el componente raíz de la aplicación.
   */
  bootstrap: [AppComponent]
})
export class AppModule { }
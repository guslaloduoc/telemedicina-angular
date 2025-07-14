import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

// 1. Importamos los componentes, tanto standalone como no-standalone.
import { PublicLayoutComponent } from './features/layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './features/layouts/auth-layout/auth-layout.component';

@NgModule({
  /**
   * @description
   * El conjunto de componentes, directivas y pipes que pertenecen a este módulo.
   * Aquí solo van los componentes NO-STANDALONE.
   */
  declarations: [
    AppComponent // Solo AppComponent se queda aquí, asumiendo que no es standalone.
  ],
  /**
   * @description
   * La lista de otros MÓDULOS y componentes STANDALONE cuyas clases exportadas son necesarias.
   */
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    // 2. Importamos los layouts standalone aquí, como si fueran módulos.
    PublicLayoutComponent,
    AuthLayoutComponent
  ],
  /**
   * @description
   * Proveedores de servicios para la inyección de dependencias.
   * Aquí se registra el `HttpClient` para toda la aplicación.
   */
  providers: [
    provideHttpClient() // El provider para HttpClient
  ],
  /**
   * @description
   * El componente principal que Angular crea e inserta en el `index.html`
   * como el componente raíz de la aplicación.
   */
  bootstrap: [AppComponent]
})
export class AppModule { }

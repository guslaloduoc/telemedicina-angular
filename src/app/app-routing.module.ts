import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { PsicologiaComponent } from './pages/public/psicologia/psicologia.component';
import { MedicinaGeneralComponent } from './pages/public/medicina-general/medicina-general.component';
import { MedicinaIntegrativaComponent } from './pages/public/medicina-integrativa/medicina-integrativa.component';

// 1. Importamos los nuevos componentes de layout desde su nueva ruta en 'features'
import { PublicLayoutComponent } from './features/layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './features/layouts/auth-layout/auth-layout.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // ...y estas son sus rutas hijas
      { path: 'home', component: HomeComponent },
      { path: 'psicologia', component: PsicologiaComponent },
      { path: 'medicina-general', component: MedicinaGeneralComponent },
      { path: 'medicina-integrativa', component: MedicinaIntegrativaComponent },
      {
        path: 'user',
        canActivate: [authGuard], 
        loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'admin',
        canActivate: [adminGuard], 
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Wildcard al final si ninguna ruta coincide
  { path: '**', redirectTo: 'home' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
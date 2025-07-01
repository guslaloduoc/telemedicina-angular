import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../../pages/user/profile/profile.component';
import { CartComponent } from '../../pages/user/cart/cart.component';

const routes: Routes = [
  { path: 'perfil', component: ProfileComponent },
  { path: 'carrito', component: CartComponent },
  { path: '', redirectTo: 'perfil', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
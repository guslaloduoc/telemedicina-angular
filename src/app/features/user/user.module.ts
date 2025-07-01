import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

import { ProfileComponent } from '../../pages/user/profile/profile.component';
import { CartComponent } from '../../pages/user/cart/cart.component';

@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CartComponent,
    ProfileComponent
  ]
})
export class UserModule { }

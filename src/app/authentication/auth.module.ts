import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from './signup/signup.component';



@NgModule({
  declarations: [ //se pone declaration porque se esta utilizando el routing (app-routing.module.ts)
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ],
})

export class AuthModule {

}

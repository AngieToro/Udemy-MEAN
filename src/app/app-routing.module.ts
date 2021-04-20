import { NgModule } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthGuard } from './authentication/auth.guard';


//se maneja globalmente, por eso n se necesita hacer export explicito de los componentes declarados
const routes: Routes = [

  {
    path: '', //main
    component: PostListComponent
  },
  {
    path: 'create', //http://localhost:4200/create
    component:  PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update/:postId', //http://localhost:4200/update/345435q3
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',  //http://localhost:4200/login
    component: LoginComponent
  },
  {
    path: 'signup', //http://localhost:4200/signup
    component: SignupComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})

export class AppRoutingModule {}

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';


//es un servicio que permite proteger las rutas escritas manualmente
//es decir si estas signout y pones la ruta localhost:4200/create
//la pagina redirige al login
@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthenticationService, private router: Router){

  }


  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot):
              boolean | Observable<boolean> | Promise<boolean> {

    const isAuth = this.authService.getIsAuth();  //ver si esta  autenticado o no

    if (!isAuth){
      this.router.navigate(['/login']); //sino esta autenticado redirige al login
    }

    return isAuth;
  }
}

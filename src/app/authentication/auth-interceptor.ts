import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';

@Injectable() //vacio para que se puedan inyectar servicios
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthenticationService){

  }

  //es como un middleware, pero solo para solicitudes salientes y no entrantes
  //funciones que se ejecutran en cualquier solicitud http saliente y luego se pueden modificar esas solicitudes
  //en este caso se utulizara para adjuntar el token
  //sirve tambien para agregar el encabezado de autenticacion
  intercept(req: HttpRequest<any>, next: HttpHandler){

    const authToken = this.authService.getToken();

    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });  //permite clonar la solicitud, para mejor la eficinecia y seguritd de la funcionalidad porque sino puede causar efetos secundarios no deseados y problema

    //el Bearer es una convencion que se utiliza

    return next.handle(authRequest);

  }
}

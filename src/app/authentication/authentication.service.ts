import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

import { Subject } from "rxjs";

import { AuthenticationData } from "./authenticationModel";
import { environment } from "../../environments/environment";

const userSingUpUrl = environment.apiUrl + "/user/signup";
const userLoginUrl = environment.apiUrl + "/user/login";


@Injectable({ providedIn: "root" })
export class AuthenticationService {

private token: string;
private authStatusListener = new Subject<boolean>();
private isAuthenticated = false;
private tokenTimer: any;//NodeJS.Timer;
private userId: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  //volver publica la variable para ser accedida desde otra parte
  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(emailP: string, passwordP: string){

    const authData: AuthenticationData = {
      email: emailP,
      password: passwordP
    };

    this.http.post(userSingUpUrl, authData)
              //.subscribe(response => {
                //console.log("Crear= ", response);
              .subscribe(() => {
                this.router.navigate["/"];
              }, error => {
                this.authStatusListener.next(false);
              });
  }

  loginUser(emailP: string, passwordP: string){

    const authData: AuthenticationData = {
      email: emailP,
      password: passwordP
    };

    //pendiente con estos parametros, escribirlos extactamente igual al response del server
    this.http.post<{ token: string, expiresIn: number, userId: string }>
                  (userLoginUrl, authData)
            .subscribe(response => {

              const token = response.token;
              this.token = token;

              if (token){
                const expireInDuration = response.expiresIn;
                this.setAuthTimer(expireInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userId);
                this.router.navigate(['/']); //redirecciona a la pgina de inicio
              }
            }, error => {
              this.authStatusListener.next(false);
            });

  }

  //autenticar automaticamente el usuario si se obtiene la informacion en local storage
  autoAuthUser(){

    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    //si es menor a 0 se sabe que el token cadudo
    if (expireIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }

  }

  logout(){

    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){

    console.log("Setting timer= ", duration);
    //trabaja en milisegundos, por eso multiplicar 1000
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //guardar el token, por si se reinicia la pagina tenerlo almacenado
  private saveAuthData (token: string, expirationDate: Date, userId: string){

    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }

  }
}
